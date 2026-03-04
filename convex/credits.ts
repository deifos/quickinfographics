import { query, mutation, internalMutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const FREE_CREDITS = 1;

export const getCredits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const record = await ctx.db
      .query("userCredits")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!record) {
      return { credits: FREE_CREDITS, initialized: false, isFreeCredit: true };
    }

    // Check if user has ever purchased credits
    const hasPurchases = await ctx.db
      .query("creditPurchases")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    const isFreeCredit = !hasPurchases && record.credits <= FREE_CREDITS;

    return { credits: record.credits, initialized: true, isFreeCredit };
  },
});

export const initCredits = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const existing = await ctx.db
      .query("userCredits")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!existing) {
      await ctx.db.insert("userCredits", {
        userId,
        credits: FREE_CREDITS,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { credits: FREE_CREDITS };
    }

    return { credits: existing.credits };
  },
});

export const useCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const record = await ctx.db
      .query("userCredits")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!record) {
      // Auto-initialize with free credits and use one
      await ctx.db.insert("userCredits", {
        userId,
        credits: FREE_CREDITS - 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { credits: FREE_CREDITS - 1, success: true };
    }

    if (record.credits <= 0) {
      return { credits: 0, success: false };
    }

    await ctx.db.patch(record._id, {
      credits: record.credits - 1,
      updatedAt: Date.now(),
    });

    return { credits: record.credits - 1, success: true };
  },
});

export const refundCredit = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const record = await ctx.db
      .query("userCredits")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (record) {
      await ctx.db.patch(record._id, {
        credits: record.credits + 1,
        updatedAt: Date.now(),
      });
      return { credits: record.credits + 1 };
    }

    // Edge case: no record exists, create one with 1 credit
    await ctx.db.insert("userCredits", {
      userId,
      credits: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { credits: 1 };
  },
});

// Internal mutation — cannot be called from external clients directly
export const addCredits = internalMutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    stripeSessionId: v.string(),
    plan: v.string(),
    amountPaid: v.number(),
  },
  handler: async (
    ctx,
    { userId, amount, stripeSessionId, plan, amountPaid },
  ) => {
    // Check if this purchase was already processed (idempotency)
    const existingPurchase = await ctx.db
      .query("creditPurchases")
      .withIndex("stripeSessionId", (q) =>
        q.eq("stripeSessionId", stripeSessionId),
      )
      .first();

    if (existingPurchase) {
      // Already processed, return current credits
      const record = await ctx.db
        .query("userCredits")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .first();
      return { credits: record?.credits ?? 0, alreadyProcessed: true };
    }

    // Record the purchase
    await ctx.db.insert("creditPurchases", {
      userId,
      stripeSessionId,
      plan,
      credits: amount,
      amount: amountPaid,
      status: "completed",
      createdAt: Date.now(),
    });

    // Add credits to user
    const record = await ctx.db
      .query("userCredits")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (record) {
      await ctx.db.patch(record._id, {
        credits: record.credits + amount,
        updatedAt: Date.now(),
      });
      return { credits: record.credits + amount, alreadyProcessed: false };
    } else {
      await ctx.db.insert("userCredits", {
        userId,
        credits: amount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { credits: amount, alreadyProcessed: false };
    }
  },
});

// Public action wrapper — validates a shared secret before calling the internal mutation.
// The WEBHOOK_SECRET env var must be set in both the Convex dashboard and Next.js .env.
export const addCreditsFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    amount: v.number(),
    stripeSessionId: v.string(),
    plan: v.string(),
    amountPaid: v.number(),
  },
  handler: async (
    ctx,
    { webhookSecret, ...rest },
  ): Promise<{ credits: number; alreadyProcessed: boolean }> => {
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret || webhookSecret !== secret) {
      throw new Error("Unauthorized");
    }

    return await ctx.runMutation(internal.credits.addCredits, rest);
  },
});
