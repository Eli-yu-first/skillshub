import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
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
  addFavorite, removeFavorite, getUserFavorites, isFavorited, getUserFavoriteSkills,
  getSkillReviews, createSkillReview, getSkillAverageRating,
  getRelatedSkills, forkSkill, searchSkillsFullText,
  createSkill, updateSkill, createSkillFile, updateSkillFiles,
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
    related: publicProcedure
      .input(z.object({ skillId: z.number(), categoryId: z.number().nullable(), tags: z.array(z.string()).nullable(), limit: z.number().optional() }))
      .query(({ input }) => getRelatedSkills(input.skillId, input.categoryId, input.tags, input.limit)),
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => searchSkillsFullText(input.query, input.limit, input.offset)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        readme: z.string().optional(),
        type: z.enum(['prompt', 'agent', 'tool', 'rpa', 'workflow', 'template']).optional(),
        categoryId: z.number().optional(),
        tags: z.array(z.string()).optional(),
        license: z.string().optional(),
        isPublic: z.boolean().optional(),
        files: z.array(z.object({
          path: z.string(),
          name: z.string(),
          content: z.string().nullable(),
          size: z.number(),
          mimeType: z.string().nullable(),
          isDirectory: z.boolean(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { files, tags, ...skillData } = input;
        const result = await createSkill({
          ...skillData,
          author: ctx.user.name || 'Anonymous',
          userId: ctx.user.id,
          tags: tags ? JSON.stringify(tags) : null,
        } as any);
        if (files && files.length > 0) {
          for (const file of files) {
            await createSkillFile({ skillId: result.id, ...file });
          }
        }
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        readme: z.string().optional(),
        type: z.enum(['prompt', 'agent', 'tool', 'rpa', 'workflow', 'template']).optional(),
        categoryId: z.number().optional(),
        tags: z.array(z.string()).optional(),
        license: z.string().optional(),
        isPublic: z.boolean().optional(),
        files: z.array(z.object({
          path: z.string(),
          name: z.string(),
          content: z.string().nullable(),
          size: z.number(),
          mimeType: z.string().nullable(),
          isDirectory: z.boolean(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, files, tags, ...data } = input;
        await updateSkill(id, { ...data, tags: tags ? JSON.stringify(tags) : undefined } as any);
        if (files) {
          await updateSkillFiles(id, files);
        }
        return { success: true };
      }),
    fork: protectedProcedure
      .input(z.object({ skillId: z.number() }))
      .mutation(({ ctx, input }) => forkSkill(input.skillId, ctx.user.id, ctx.user.name || 'Anonymous')),
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

  // Favorites
  favorites: router({
    add: protectedProcedure
      .input(z.object({ targetType: z.string(), targetId: z.number() }))
      .mutation(({ ctx, input }) => addFavorite(ctx.user.id, input.targetType, input.targetId)),
    remove: protectedProcedure
      .input(z.object({ targetType: z.string(), targetId: z.number() }))
      .mutation(({ ctx, input }) => removeFavorite(ctx.user.id, input.targetType, input.targetId)),
    list: protectedProcedure
      .input(z.object({ targetType: z.string().optional() }).optional())
      .query(({ ctx, input }) => getUserFavorites(ctx.user.id, input?.targetType)),
    check: protectedProcedure
      .input(z.object({ targetType: z.string(), targetId: z.number() }))
      .query(({ ctx, input }) => isFavorited(ctx.user.id, input.targetType, input.targetId)),
    skills: protectedProcedure
      .query(({ ctx }) => getUserFavoriteSkills(ctx.user.id)),
  }),

  // Reviews
  reviews: router({
    list: publicProcedure
      .input(z.object({ skillId: z.number() }))
      .query(({ input }) => getSkillReviews(input.skillId)),
    rating: publicProcedure
      .input(z.object({ skillId: z.number() }))
      .query(({ input }) => getSkillAverageRating(input.skillId)),
    create: protectedProcedure
      .input(z.object({
        skillId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => createSkillReview({
        skillId: input.skillId,
        userId: ctx.user.id,
        rating: input.rating,
        comment: input.comment || null,
      })),
  }),

  // Platform stats
  stats: router({
    platform: publicProcedure.query(() => getPlatformStats()),
  }),
});

export type AppRouter = typeof appRouter;
