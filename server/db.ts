import { eq, like, desc, asc, sql, and, or, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  categories, skills, contexts, playgrounds,
  discussions, discussionReplies, likes,
  organizations, agents, blogPosts, collections,
  skillFiles, skillCommits, userFavorites,
  skillReviews, skillForks,
  type InsertSkill, type InsertContext, type InsertPlayground,
  type InsertCategory, type InsertAgent,
  type InsertSkillReview,
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
    case 'alphabetical': orderBy = asc(skills.name); break;
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
// USER FAVORITES
// ============================================================================
export async function addFavorite(userId: number, targetType: string, targetId: number) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(userFavorites).values({
      userId,
      targetType: targetType as any,
      targetId,
    });
    return true;
  } catch (e: any) {
    if (e?.code === 'ER_DUP_ENTRY') return false;
    throw e;
  }
}

export async function removeFavorite(userId: number, targetType: string, targetId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(userFavorites).where(
    and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.targetType, targetType as any),
      eq(userFavorites.targetId, targetId)
    )
  );
  return true;
}

export async function getUserFavorites(userId: number, targetType?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(userFavorites.userId, userId)];
  if (targetType) conditions.push(eq(userFavorites.targetType, targetType as any));
  return db.select().from(userFavorites)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(userFavorites.createdAt));
}

export async function isFavorited(userId: number, targetType: string, targetId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: userFavorites.id }).from(userFavorites)
    .where(and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.targetType, targetType as any),
      eq(userFavorites.targetId, targetId)
    )).limit(1);
  return result.length > 0;
}

export async function getUserFavoriteSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const favs = await db.select().from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.targetType, 'skill')))
    .orderBy(desc(userFavorites.createdAt));
  if (favs.length === 0) return [];
  const ids = favs.map(f => f.targetId);
  return db.select().from(skills).where(inArray(skills.id, ids));
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

// ============================================================================
// SKILL REVIEWS
// ============================================================================
export async function getSkillReviews(skillId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: skillReviews.id,
    skillId: skillReviews.skillId,
    userId: skillReviews.userId,
    rating: skillReviews.rating,
    comment: skillReviews.comment,
    createdAt: skillReviews.createdAt,
    userName: users.name,
  })
    .from(skillReviews)
    .leftJoin(users, eq(users.id, skillReviews.userId))
    .where(eq(skillReviews.skillId, skillId))
    .orderBy(desc(skillReviews.createdAt));
}

export async function createSkillReview(data: InsertSkillReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(skillReviews).values(data);
}

export async function getSkillAverageRating(skillId: number) {
  const db = await getDb();
  if (!db) return { average: 0, count: 0 };
  const result = await db.select({
    average: sql<number>`AVG(rating)`,
    count: sql<number>`COUNT(*)`,
  }).from(skillReviews).where(eq(skillReviews.skillId, skillId));
  return {
    average: result[0]?.average || 0,
    count: result[0]?.count || 0,
  };
}

// ============================================================================
// RELATED SKILLS (by category + tags)
// ============================================================================
export async function getRelatedSkills(skillId: number, categoryId: number | null, tags: string[] | null, limit = 6) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [sql`${skills.id} != ${skillId}`, eq(skills.isPublic, true)];
  if (categoryId) {
    conditions.push(eq(skills.categoryId, categoryId));
  }
  return db.select().from(skills)
    .where(and(...conditions))
    .orderBy(desc(skills.likes))
    .limit(limit);
}

// ============================================================================
// SKILL FORKS
// ============================================================================
export async function forkSkill(originalSkillId: number, userId: number, userName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Get original skill
  const [original] = await db.select().from(skills).where(eq(skills.id, originalSkillId)).limit(1);
  if (!original) throw new Error("Skill not found");
  // Create forked skill
  const slug = `${original.slug}-fork-${Date.now()}`;
  const [result] = await db.insert(skills).values({
    name: `${original.name} (Fork)`,
    slug,
    author: userName,
    description: original.description,
    readme: original.readme,
    type: original.type,
    categoryId: original.categoryId,
    tags: original.tags,
    license: original.license,
    version: "1.0.0",
    isPublic: true,
    userId,
    config: original.config,
    inputSchema: original.inputSchema,
    outputSchema: original.outputSchema,
    compatibleModels: original.compatibleModels,
  }).$returningId();
  // Record fork relationship
  await db.insert(skillForks).values({
    originalSkillId,
    forkedSkillId: result.id,
    userId,
  });
  // Update fork count on original
  await db.update(skills).set({ forks: sql`${skills.forks} + 1` }).where(eq(skills.id, originalSkillId));
  // Copy files
  const files = await db.select().from(skillFiles).where(eq(skillFiles.skillId, originalSkillId));
  if (files.length > 0) {
    await db.insert(skillFiles).values(files.map(f => ({
      skillId: result.id,
      path: f.path,
      name: f.name,
      content: f.content,
      size: f.size,
      mimeType: f.mimeType,
      isDirectory: f.isDirectory,
    })));
  }
  return { id: result.id, slug };
}

// ============================================================================
// FULL-TEXT SEARCH
// ============================================================================
export async function searchSkillsFullText(query: string, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const searchTerm = `%${query}%`;
  const conditions = and(
    eq(skills.isPublic, true),
    or(
      sql`${skills.name} LIKE ${searchTerm}`,
      sql`${skills.description} LIKE ${searchTerm}`,
      sql`${skills.readme} LIKE ${searchTerm}`,
      sql`JSON_SEARCH(${skills.tags}, 'one', ${searchTerm}) IS NOT NULL`,
      sql`${skills.author} LIKE ${searchTerm}`,
    )
  );
  const [items, countResult] = await Promise.all([
    db.select().from(skills).where(conditions).orderBy(desc(skills.likes)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(skills).where(conditions),
  ]);
  return { items, total: countResult[0]?.count || 0 };
}

// ============================================================================
// CREATE / UPDATE SKILL
// ============================================================================
export async function createSkill(data: InsertSkill) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(skills).values(data).$returningId();
  return result;
}

export async function updateSkill(id: number, data: Partial<InsertSkill>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(skills).set(data).where(eq(skills.id, id));
}

export async function createSkillFile(data: { skillId: number; path: string; name: string; content: string | null; size: number; mimeType: string | null; isDirectory: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(skillFiles).values(data);
}

export async function updateSkillFiles(skillId: number, files: { path: string; name: string; content: string | null; size: number; mimeType: string | null; isDirectory: boolean }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete existing files
  await db.delete(skillFiles).where(eq(skillFiles.skillId, skillId));
  // Insert new files
  if (files.length > 0) {
    await db.insert(skillFiles).values(files.map(f => ({ skillId, ...f })));
  }
}


// User profile queries
export async function getUserSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];
  // Get user's openId first, then find skills by author
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length) return [];
  const userName = user[0].name || user[0].openId;
  return db.select().from(skills).where(eq(skills.author, userName)).orderBy(desc(skills.createdAt)).limit(50);
}

export async function getUserAgents(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length) return [];
  const userName = user[0].name || user[0].openId;
  return db.select().from(agents).where(eq(agents.author, userName)).orderBy(desc(agents.createdAt)).limit(50);
}

// ── Version Control ──
export async function createSkillCommit(data: {
  skillId: number;
  message: string;
  authorName: string;
  additions?: number;
  deletions?: number;
  snapshot?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const hash = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  await db.insert(skillCommits).values({
    ...data,
    hash,
  });
  return { hash };
}

export async function getSkillCommitByHash(skillId: number, hash: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(skillCommits)
    .where(and(eq(skillCommits.skillId, skillId), eq(skillCommits.hash, hash)))
    .limit(1);
  return result[0] || null;
}

export async function rollbackSkillToCommit(skillId: number, commitHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const commit = await getSkillCommitByHash(skillId, commitHash);
  if (!commit || !commit.snapshot) throw new Error("Commit not found or no snapshot");
  const snapshot = JSON.parse(commit.snapshot);
  // Restore files from snapshot
  if (snapshot.files) {
    // Delete current files
    await db.delete(skillFiles).where(eq(skillFiles.skillId, skillId));
    // Insert snapshot files
    for (const file of snapshot.files) {
      await db.insert(skillFiles).values({
        skillId,
        path: file.path,
        name: file.name,
        content: file.content,
        size: file.size || 0,
        mimeType: file.mimeType || null,
        isDirectory: file.isDirectory || false,
      });
    }
  }
  // Restore readme if present
  if (snapshot.readme !== undefined) {
    await db.update(skills).set({ readme: snapshot.readme }).where(eq(skills.id, skillId));
  }
  return { success: true };
}
