import { query } from "./_generated/server";
import { ADMIN_USER_IDS } from "./adminIds";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Verify the user is an admin
    if (!ADMIN_USER_IDS.includes(identity.subject)) {
      return null;
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get all credit purchases
    const allPurchases = await ctx.db.query("creditPurchases").collect();

    // Get all user credits
    const allUserCredits = await ctx.db.query("userCredits").collect();

    // Revenue stats
    const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amount, 0);
    const totalCreditsSold = allPurchases.reduce((sum, p) => sum + p.credits, 0);
    const totalPurchases = allPurchases.length;

    // Revenue by plan
    const revenueByPlan: Record<string, { count: number; revenue: number; credits: number }> = {};
    for (const p of allPurchases) {
      if (!revenueByPlan[p.plan]) {
        revenueByPlan[p.plan] = { count: 0, revenue: 0, credits: 0 };
      }
      revenueByPlan[p.plan].count++;
      revenueByPlan[p.plan].revenue += p.amount;
      revenueByPlan[p.plan].credits += p.credits;
    }

    // Purchases over time periods
    const purchasesToday = allPurchases.filter((p) => p.createdAt >= oneDayAgo).length;
    const purchasesThisWeek = allPurchases.filter((p) => p.createdAt >= oneWeekAgo).length;
    const purchasesThisMonth = allPurchases.filter((p) => p.createdAt >= oneMonthAgo).length;

    // Revenue over time periods
    const revenueToday = allPurchases
      .filter((p) => p.createdAt >= oneDayAgo)
      .reduce((sum, p) => sum + p.amount, 0);
    const revenueThisWeek = allPurchases
      .filter((p) => p.createdAt >= oneWeekAgo)
      .reduce((sum, p) => sum + p.amount, 0);
    const revenueThisMonth = allPurchases
      .filter((p) => p.createdAt >= oneMonthAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    // Credits usage stats
    const totalCreditsRemaining = allUserCredits.reduce((sum, u) => sum + u.credits, 0);
    const totalUsersWithCredits = allUserCredits.length;
    const freeCreditsGiven = totalUsersWithCredits; // 1 free credit per user
    const totalCreditsUsed = freeCreditsGiven + totalCreditsSold - totalCreditsRemaining;

    // Recent purchases (latest 20)
    const recentPurchases = allPurchases
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20)
      .map((p) => ({
        id: p._id,
        userId: p.userId,
        plan: p.plan,
        credits: p.credits,
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt,
      }));

    // Unique paying users
    const uniquePayingUsers = new Set(allPurchases.map((p) => p.userId)).size;

    return {
      // Overview
      totalRevenue,
      totalCreditsSold,
      totalCreditsUsed,
      totalCreditsRemaining,
      totalPurchases,
      totalUsersWithCredits,
      uniquePayingUsers,

      // Time-based
      purchasesToday,
      purchasesThisWeek,
      purchasesThisMonth,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,

      // Breakdown
      revenueByPlan,
      recentPurchases,
    };
  },
});
