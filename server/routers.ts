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
  getDiscussions, createDiscussion,
  getOrganizations,
  getAgents,
  getBlogPosts,
  getCollections,
  getPlatformStats,
  addFavorite, removeFavorite, getUserFavorites, isFavorited, getUserFavoriteSkills,
  getSkillReviews, createSkillReview, getSkillAverageRating,
  getRelatedSkills, forkSkill, searchSkillsFullText,
  createSkill, updateSkill, createSkillFile, updateSkillFiles,
  getUserSkills, getUserAgents,
  createSkillCommit, getSkillCommitByHash, rollbackSkillToCommit,
} from "./db";
import { invokeLLM } from "./_core/llm";

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
    // Version control
    createCommit: protectedProcedure
      .input(z.object({
        skillId: z.number(),
        message: z.string().min(1),
        snapshot: z.string().optional(),
        additions: z.number().optional(),
        deletions: z.number().optional(),
      }))
      .mutation(({ ctx, input }) => createSkillCommit({
        ...input,
        authorName: ctx.user.name || 'Anonymous',
      })),
    commitDetail: publicProcedure
      .input(z.object({ skillId: z.number(), hash: z.string() }))
      .query(({ input }) => getSkillCommitByHash(input.skillId, input.hash)),
    rollback: protectedProcedure
      .input(z.object({ skillId: z.number(), commitHash: z.string() }))
      .mutation(({ input }) => rollbackSkillToCommit(input.skillId, input.commitHash)),
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
    create: protectedProcedure
      .input(z.object({
        targetType: z.string(),
        targetId: z.number(),
        title: z.string().min(1),
        content: z.string().min(1)
      }))
      .mutation(({ ctx, input }) => createDiscussion({
        userId: ctx.user.id,
        ...input
      })),
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

  // Agent Chat - Real LLM integration
  agentChat: router({
    send: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
        })),
        systemPrompt: z.string().optional(),
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().min(256).max(16384).optional(),
        skills: z.array(z.object({
          name: z.string(),
          type: z.string(),
        })).optional(),
        modelProvider: z.string().optional(),
        apiKey: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { messages, systemPrompt, temperature, maxTokens, skills, modelProvider, apiKey } = input;

        // Build system prompt with skill context
        const skillContext = skills && skills.length > 0
          ? `\n\nYou have the following skills available as team members:\n${skills.map((s, i) => `${i + 1}. **${s.name}** (${s.type})`).join('\n')}\n\nWhen processing user requests, analyze which skills are relevant and dispatch tasks accordingly. Always mention which skills you're using in your response.`
          : '';

        const fullSystemPrompt = (systemPrompt || 'You are a helpful AI assistant.') + skillContext;

        // If user provided their own API key and model provider, use external API
        if (apiKey && modelProvider) {
          try {
            const providerUrls: Record<string, string> = {
              'OpenAI': 'https://api.openai.com/v1/chat/completions',
              'Anthropic': 'https://api.anthropic.com/v1/messages',
              'Google': 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
              'Mistral': 'https://api.mistral.ai/v1/chat/completions',
              'Cohere': 'https://api.cohere.ai/v1/chat',
            };

            const providerModels: Record<string, string> = {
              'OpenAI': 'gpt-4o',
              'Anthropic': 'claude-3-5-sonnet-20241022',
              'Google': 'gemini-1.5-pro',
              'Mistral': 'mistral-large-latest',
              'Cohere': 'command-r-plus',
            };

            // For Anthropic, use different API format
            if (modelProvider === 'Anthropic') {
              const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'x-api-key': apiKey,
                  'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                  model: providerModels['Anthropic'],
                  max_tokens: maxTokens || 4096,
                  system: fullSystemPrompt,
                  messages: messages.filter(m => m.role !== 'system').map(m => ({
                    role: m.role,
                    content: m.content,
                  })),
                }),
              });

              if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Anthropic API error: ${response.status} - ${errText}`);
              }

              const data = await response.json() as any;
              return {
                content: data.content?.[0]?.text || 'No response generated.',
                model: providerModels['Anthropic'],
                provider: 'Anthropic',
                tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
              };
            }

            // OpenAI-compatible API format (OpenAI, Google, Mistral)
            const apiUrl = providerUrls[modelProvider] || providerUrls['OpenAI'];
            const model = providerModels[modelProvider] || 'gpt-4o';

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: fullSystemPrompt },
                  ...messages.filter(m => m.role !== 'system'),
                ],
                temperature: temperature || 0.7,
                max_tokens: maxTokens || 4096,
              }),
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`${modelProvider} API error: ${response.status} - ${errText}`);
            }

            const data = await response.json() as any;
            return {
              content: data.choices?.[0]?.message?.content || 'No response generated.',
              model,
              provider: modelProvider,
              tokensUsed: data.usage?.total_tokens || 0,
            };
          } catch (error: any) {
            // Fallback to built-in LLM if external API fails
            console.error(`External ${modelProvider} API failed:`, error.message);
            // Fall through to built-in LLM
          }
        }

        // Use built-in LLM (Manus Forge API)
        try {
          const llmMessages = [
            { role: 'system' as const, content: fullSystemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          ];

          const result = await invokeLLM({ messages: llmMessages });
          const content = result.choices?.[0]?.message?.content || 'No response generated.';

          return {
            content,
            model: 'gemini-2.5-flash',
            provider: 'SkillsHub Built-in',
            tokensUsed: result.usage?.total_tokens || 0,
          };
        } catch (error: any) {
          return {
            content: `I apologize, but I encountered an error processing your request: ${error.message}. Please try again.`,
            model: 'fallback',
            provider: 'error',
            tokensUsed: 0,
          };
        }
      }),
  }),

  // User profile data
  profile: router({
    mySkills: protectedProcedure.query(({ ctx }) => getUserSkills(ctx.user.id)),
    myAgents: protectedProcedure.query(({ ctx }) => getUserAgents(ctx.user.id)),
    myFavorites: protectedProcedure.query(({ ctx }) => getUserFavoriteSkills(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
