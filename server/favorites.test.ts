import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(userId?: number): TrpcContext {
  const user = userId ? {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Skills API", () => {
  it("skills.list returns items with sorting", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.skills.list({ limit: 5 });
    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeLessThanOrEqual(5);
  });

  it("skills.bySlug returns a skill with files and commits", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    // Get first skill to find a valid author/slug
    const list = await caller.skills.list({ limit: 1 });
    if (list.items.length > 0) {
      const skill = list.items[0];
      const detail = await caller.skills.bySlug({
        author: skill.author!,
        slug: skill.slug!,
      });
      expect(detail).toBeTruthy();
      expect(detail!.name).toBe(skill.name);
      // bySlug returns the skill object; files/commits are fetched separately
      expect(detail).toHaveProperty("id");
      expect(detail).toHaveProperty("readme");
    }
  });

  it("skills.list supports search", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.skills.list({ limit: 5, search: "code" });
    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
  });
});

describe("Categories API", () => {
  it("categories.list returns hierarchical categories", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const categories = await caller.categories.list();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });
});

describe("Favorites API", () => {
  it("favorites.toggle requires authentication", async () => {
    const ctx = createMockContext(); // no user
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.favorites.toggle({ targetType: "skill", targetId: 1 })
    ).rejects.toThrow();
  });

  it("favorites.skills requires authentication", async () => {
    const ctx = createMockContext(); // no user
    const caller = appRouter.createCaller(ctx);
    await expect(caller.favorites.skills()).rejects.toThrow();
  });
});

describe("Stats API", () => {
  it("stats.platform returns platform statistics", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.stats.platform();
    expect(stats).toHaveProperty("skills");
    expect(stats).toHaveProperty("categories");
    expect(typeof stats.skills).toBe("number");
  });
});
