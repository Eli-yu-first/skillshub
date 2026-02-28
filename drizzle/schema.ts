import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

// ============================================================================
// USERS
// ============================================================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  website: varchar("website", { length: 512 }),
  githubHandle: varchar("githubHandle", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// CATEGORIES (50 skill domains) - hierarchical
// ============================================================================
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),  // not unique - sub-categories may share names
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  color: varchar("color", { length: 32 }),
  parentId: int("parentId"),
  level: int("level").default(0).notNull(),
  skillCount: int("skillCount").default(0).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ============================================================================
// SKILLS
// ============================================================================
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  author: varchar("author", { length: 128 }).notNull(),
  description: text("description"),
  readme: text("readme"),
  type: mysqlEnum("type", ["prompt", "agent", "tool", "rpa", "workflow", "template"]).default("prompt").notNull(),
  categoryId: int("categoryId"),
  tags: json("tags").$type<string[]>(),
  license: varchar("license", { length: 64 }).default("MIT"),
  version: varchar("version", { length: 32 }).default("1.0.0"),
  downloads: int("downloads").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  forks: int("forks").default(0).notNull(),
  stars: int("stars").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  compatibleModels: json("compatibleModels").$type<string[]>(),
  inputSchema: json("inputSchema"),
  outputSchema: json("outputSchema"),
  config: json("config"),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

// ============================================================================
// SKILL FILES
// ============================================================================
export const skillFiles = mysqlTable("skill_files", {
  id: int("id").autoincrement().primaryKey(),
  skillId: int("skillId").notNull(),
  path: varchar("path", { length: 512 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content"),
  size: int("size").default(0),
  mimeType: varchar("mimeType", { length: 128 }),
  isDirectory: boolean("isDirectory").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SkillFile = typeof skillFiles.$inferSelect;

// ============================================================================
// SKILL COMMITS (version history)
// ============================================================================
export const skillCommits = mysqlTable("skill_commits", {
  id: int("id").autoincrement().primaryKey(),
  skillId: int("skillId").notNull(),
  hash: varchar("hash", { length: 64 }).notNull(),
  message: text("message").notNull(),
  authorName: varchar("authorName", { length: 128 }),
  additions: int("additions").default(0),
   deletions: int("deletions").default(0),
  snapshot: text("snapshot"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SkillCommit = typeof skillCommits.$inferSelect;

// ============================================================================
// CONTEXTS (datasets)
// ============================================================================
export const contexts = mysqlTable("contexts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  author: varchar("author", { length: 128 }).notNull(),
  description: text("description"),
  readme: text("readme"),
  format: varchar("format", { length: 64 }),
  size: varchar("size", { length: 32 }),
  rows: int("rows").default(0),
  tags: json("tags").$type<string[]>(),
  license: varchar("license", { length: 64 }).default("MIT"),
  downloads: int("downloads").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Context = typeof contexts.$inferSelect;
export type InsertContext = typeof contexts.$inferInsert;

// ============================================================================
// PLAYGROUNDS
// ============================================================================
export const playgrounds = mysqlTable("playgrounds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  author: varchar("author", { length: 128 }).notNull(),
  description: text("description"),
  readme: text("readme"),
  runtime: varchar("runtime", { length: 64 }),
  emoji: varchar("emoji", { length: 16 }),
  tags: json("tags").$type<string[]>(),
  likes: int("likes").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Playground = typeof playgrounds.$inferSelect;
export type InsertPlayground = typeof playgrounds.$inferInsert;

// ============================================================================
// DISCUSSIONS
// ============================================================================
export const discussions = mysqlTable("discussions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content"),
  status: mysqlEnum("status", ["open", "closed", "resolved"]).default("open").notNull(),
  targetType: mysqlEnum("targetType", ["skill", "context", "playground"]).notNull(),
  targetId: int("targetId").notNull(),
  userId: int("userId"),
  replyCount: int("replyCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Discussion = typeof discussions.$inferSelect;

// ============================================================================
// DISCUSSION REPLIES
// ============================================================================
export const discussionReplies = mysqlTable("discussion_replies", {
  id: int("id").autoincrement().primaryKey(),
  discussionId: int("discussionId").notNull(),
  content: text("content").notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscussionReply = typeof discussionReplies.$inferSelect;

// ============================================================================
// LIKES
// ============================================================================
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  targetType: mysqlEnum("targetType", ["skill", "context", "playground"]).notNull(),
  targetId: int("targetId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;

// ============================================================================
// ORGANIZATIONS
// ============================================================================
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  handle: varchar("handle", { length: 128 }).notNull().unique(),
  description: text("description"),
  avatar: text("avatar"),
  website: varchar("website", { length: 512 }),
  type: varchar("type", { length: 64 }),
  memberCount: int("memberCount").default(0).notNull(),
  skillCount: int("skillCount").default(0).notNull(),
  followerCount: int("followerCount").default(0).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;

// ============================================================================
// AGENTS (Deps marketplace)
// ============================================================================
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  author: varchar("author", { length: 128 }).notNull(),
  description: text("description"),
  readme: text("readme"),
  skillIds: json("skillIds").$type<number[]>(),
  modelIds: json("modelIds").$type<string[]>(),
  config: json("config"),
  status: mysqlEnum("status", ["draft", "published", "deployed"]).default("draft").notNull(),
  deployUrl: text("deployUrl"),
  likes: int("likes").default(0).notNull(),
  runs: int("runs").default(0).notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// ============================================================================
// BLOG POSTS
// ============================================================================
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  slug: varchar("slug", { length: 512 }).notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("coverImage"),
  authorName: varchar("authorName", { length: 128 }),
  tags: json("tags").$type<string[]>(),
  isPublished: boolean("isPublished").default(true).notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;

// ============================================================================
// COLLECTIONS
// ============================================================================
export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  description: text("description"),
  itemCount: int("itemCount").default(0).notNull(),
  userId: int("userId"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;

// ============================================================================
// USER FAVORITES
// ============================================================================
export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  targetType: mysqlEnum("targetType", ["skill", "context", "playground", "agent"]).notNull(),
  targetId: int("targetId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

// ============================================================================
// AGENT SKILLS (many-to-many)
// ============================================================================
export const agentSkills = mysqlTable("agent_skills", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  skillId: int("skillId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentSkill = typeof agentSkills.$inferSelect;

// ============================================================================
// SKILL REVIEWS (ratings + comments)
// ============================================================================
export const skillReviews = mysqlTable("skill_reviews", {
  id: int("id").autoincrement().primaryKey(),
  skillId: int("skillId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull().default(5),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SkillReview = typeof skillReviews.$inferSelect;
export type InsertSkillReview = typeof skillReviews.$inferInsert;

// ============================================================================
// SKILL FORKS
// ============================================================================
export const skillForks = mysqlTable("skill_forks", {
  id: int("id").autoincrement().primaryKey(),
  originalSkillId: int("originalSkillId").notNull(),
  forkedSkillId: int("forkedSkillId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkillFork = typeof skillForks.$inferSelect;
