import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("categories.list", () => {
  it("returns a list of categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("slug");
  });
});

describe("skills.list", () => {
  it("returns paginated skills with total count", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.skills.list();

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(20); // default limit
  });

  it("supports pagination with offset and limit", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const page1 = await caller.skills.list({ limit: 5, offset: 0 });
    const page2 = await caller.skills.list({ limit: 5, offset: 5 });

    expect(page1.items.length).toBe(5);
    expect(page2.items.length).toBe(5);
    // Different pages should have different items
    expect(page1.items[0].id).not.toBe(page2.items[0].id);
  });

  it("supports filtering by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get categories
    const categories = await caller.categories.list();
    const firstCategory = categories[0];

    const result = await caller.skills.list({ categoryId: firstCategory.id });

    expect(result.items.length).toBeGreaterThan(0);
    // All items should belong to the specified category
    result.items.forEach((item: any) => {
      expect(item.categoryId).toBe(firstCategory.id);
    });
  });
});

describe("skills.bySlug", () => {
  it("returns a skill by author and slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get a skill from the list
    const list = await caller.skills.list({ limit: 1 });
    const firstSkill = list.items[0];

    const result = await caller.skills.bySlug({ author: firstSkill.author, slug: firstSkill.slug });

    expect(result).not.toBeNull();
    expect(result!.slug).toBe(firstSkill.slug);
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("readme");
  });
});

describe("stats.platform", () => {
  it("returns platform statistics", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stats.platform();

    expect(result).toHaveProperty("skills");
    expect(result).toHaveProperty("contexts");
    expect(result.skills).toBeGreaterThan(0);
  });
});

describe("auth.me", () => {
  it("returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("returns user data for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).not.toBeNull();
    expect(result!.name).toBe("Test User");
    expect(result!.email).toBe("test@example.com");
  });
});
