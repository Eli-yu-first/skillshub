import { eq, like, desc, asc, sql, and, or, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  categories, skills, contexts, playgrounds,
  discussions, discussionReplies, likes,
  organizations, agents, blogPosts, collections,
  skillFiles, skillCommits,
  type InsertSkill, type InsertContext, type InsertPlayground,
  type InsertCategory, type InsertAgent,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USERS
// ============================================================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// CATEGORIES
// ============================================================================
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

// ============================================================================
// SKILLS
// ============================================================================
export async function getSkills(opts: {
  categoryId?: number;
  type?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [eq(skills.isPublic, true)];
  if (opts.categoryId) conditions.push(eq(skills.categoryId, opts.categoryId));
  if (opts.type) conditions.push(eq(skills.type, opts.type as any));
  if (opts.search) conditions.push(or(
    like(skills.name, `%${opts.search}%`),
    like(skills.description, `%${opts.search}%`),
    like(skills.author, `%${opts.search}%`)
  )!);

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const limit = opts.limit || 20;
  const offset = opts.offset || 0;

  let orderBy;
  switch (opts.sort) {
    case 'trending': orderBy = desc(skills.downloads); break;
    case 'likes': orderBy = desc(skills.likes); break;
    case 'newest': orderBy = desc(skills.createdAt); break;
    default: orderBy = desc(skills.downloads);
  }

  const [items, countResult] = await Promise.all([
    db.select().from(skills).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(skills).where(where),
  ]);

  return { items, total: countResult[0]?.count || 0 };
}

export async function getSkillBySlug(author: string, slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(skills)
    .where(and(eq(skills.author, author), eq(skills.slug, slug)))
    .limit(1);
  return result[0];
}

export async function getTrendingSkills(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills)
    .where(eq(skills.isPublic, true))
    .orderBy(desc(skills.downloads))
    .limit(limit);
}

export async function getFeaturedSkills(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills)
    .where(and(eq(skills.isPublic, true), eq(skills.isFeatured, true)))
    .orderBy(desc(skills.downloads))
    .limit(limit);
}

export async function getSkillFiles(skillId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skillFiles).where(eq(skillFiles.skillId, skillId));
}

export async function getSkillCommits(skillId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skillCommits)
    .where(eq(skillCommits.skillId, skillId))
    .orderBy(desc(skillCommits.createdAt));
}

export async function getSkillsByCategoryId(categoryId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills)
    .where(and(eq(skills.categoryId, categoryId), eq(skills.isPublic, true)))
    .orderBy(desc(skills.downloads))
    .limit(limit)
    .offset(offset);
}

// ============================================================================
// CONTEXTS
// ============================================================================
export async function getContexts(opts: {
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [eq(contexts.isPublic, true)];
  if (opts.search) conditions.push(or(
    like(contexts.name, `%${opts.search}%`),
    like(contexts.description, `%${opts.search}%`)
  )!);

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const limit = opts.limit || 20;
  const offset = opts.offset || 0;

  const [items, countResult] = await Promise.all([
    db.select().from(contexts).where(where).orderBy(desc(contexts.downloads)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(contexts).where(where),
  ]);

  return { items, total: countResult[0]?.count || 0 };
}

export async function getTrendingContexts(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contexts)
    .where(eq(contexts.isPublic, true))
    .orderBy(desc(contexts.downloads))
    .limit(limit);
}

// ============================================================================
// PLAYGROUNDS
// ============================================================================
export async function getPlaygrounds(opts: {
  search?: string;
  runtime?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [eq(playgrounds.isPublic, true)];
  if (opts.search) conditions.push(or(
    like(playgrounds.name, `%${opts.search}%`),
    like(playgrounds.description, `%${opts.search}%`)
  )!);
  if (opts.runtime) conditions.push(eq(playgrounds.runtime, opts.runtime));

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const limit = opts.limit || 20;
  const offset = opts.offset || 0;

  const [items, countResult] = await Promise.all([
    db.select().from(playgrounds).where(where).orderBy(desc(playgrounds.likes)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(playgrounds).where(where),
  ]);

  return { items, total: countResult[0]?.count || 0 };
}

export async function getTrendingPlaygrounds(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(playgrounds)
    .where(eq(playgrounds.isPublic, true))
    .orderBy(desc(playgrounds.likes))
    .limit(limit);
}

// ============================================================================
// DISCUSSIONS
// ============================================================================
export async function getDiscussions(targetType: string, targetId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(discussions)
    .where(and(
      eq(discussions.targetType, targetType as any),
      eq(discussions.targetId, targetId)
    ))
    .orderBy(desc(discussions.createdAt));
}

// ============================================================================
// ORGANIZATIONS
// ============================================================================
export async function getOrganizations(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(organizations)
    .orderBy(desc(organizations.followerCount))
    .limit(limit);
}

// ============================================================================
// AGENTS
// ============================================================================
export async function getAgents(opts: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [eq(agents.status, "published")];
  if (opts.search) conditions.push(or(
    like(agents.name, `%${opts.search}%`),
    like(agents.description, `%${opts.search}%`)
  )!);

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const limit = opts.limit || 20;
  const offset = opts.offset || 0;

  const [items, countResult] = await Promise.all([
    db.select().from(agents).where(where).orderBy(desc(agents.runs)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(agents).where(where),
  ]);

  return { items, total: countResult[0]?.count || 0 };
}

// ============================================================================
// BLOG
// ============================================================================
export async function getBlogPosts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit);
}

// ============================================================================
// COLLECTIONS
// ============================================================================
export async function getCollections(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(collections)
    .where(eq(collections.isPublic, true))
    .orderBy(desc(collections.updatedAt))
    .limit(limit);
}

// ============================================================================
// STATS
// ============================================================================
export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return { skills: 0, contexts: 0, playgrounds: 0, users: 0, categories: 0 };

  const [skillCount, contextCount, playgroundCount, userCount, categoryCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(skills),
    db.select({ count: sql<number>`count(*)` }).from(contexts),
    db.select({ count: sql<number>`count(*)` }).from(playgrounds),
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(categories),
  ]);

  return {
    skills: skillCount[0]?.count || 0,
    contexts: contextCount[0]?.count || 0,
    playgrounds: playgroundCount[0]?.count || 0,
    users: userCount[0]?.count || 0,
    categories: categoryCount[0]?.count || 0,
  };
}
