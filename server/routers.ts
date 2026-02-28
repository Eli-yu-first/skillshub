import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllCategories, getCategoryBySlug,
  getSkills, getSkillBySlug, getTrendingSkills, getFeaturedSkills,
  getSkillFiles, getSkillCommits, getSkillsByCategoryId,
  getContexts, getTrendingContexts,
  getPlaygrounds, getTrendingPlaygrounds,
  getDiscussions,
  getOrganizations,
  getAgents,
  getBlogPosts,
  getCollections,
  getPlatformStats,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(() => getAllCategories()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getCategoryBySlug(input.slug)),
  }),

  // Skills
  skills: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        type: z.string().optional(),
        search: z.string().optional(),
        sort: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(({ input }) => getSkills(input || {})),
    bySlug: publicProcedure
      .input(z.object({ author: z.string(), slug: z.string() }))
      .query(({ input }) => getSkillBySlug(input.author, input.slug)),
    trending: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getTrendingSkills(input?.limit)),
    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getFeaturedSkills(input?.limit)),
    files: publicProcedure
      .input(z.object({ skillId: z.number() }))
      .query(({ input }) => getSkillFiles(input.skillId)),
    commits: publicProcedure
      .input(z.object({ skillId: z.number() }))
      .query(({ input }) => getSkillCommits(input.skillId)),
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getSkillsByCategoryId(input.categoryId, input.limit, input.offset)),
  }),

  // Contexts
  contexts: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        sort: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(({ input }) => getContexts(input || {})),
    trending: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getTrendingContexts(input?.limit)),
  }),

  // Playgrounds
  playgrounds: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        runtime: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(({ input }) => getPlaygrounds(input || {})),
    trending: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getTrendingPlaygrounds(input?.limit)),
  }),

  // Discussions
  discussions: router({
    list: publicProcedure
      .input(z.object({ targetType: z.string(), targetId: z.number() }))
      .query(({ input }) => getDiscussions(input.targetType, input.targetId)),
  }),

  // Organizations
  organizations: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getOrganizations(input?.limit)),
  }),

  // Agents
  agents: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(({ input }) => getAgents(input || {})),
  }),

  // Blog
  blog: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getBlogPosts(input?.limit)),
  }),

  // Collections
  collections: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getCollections(input?.limit)),
  }),

  // Platform stats
  stats: router({
    platform: publicProcedure.query(() => getPlatformStats()),
  }),
});

export type AppRouter = typeof appRouter;
