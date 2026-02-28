import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userCredits: defineTable({
    userId: v.string(),
    credits: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  creditPurchases: defineTable({
    userId: v.string(),
    stripeSessionId: v.string(),
    plan: v.string(),
    credits: v.number(),
    amount: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("stripeSessionId", ["stripeSessionId"]),
});
