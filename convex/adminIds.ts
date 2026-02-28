// Admin user IDs — loaded from ADMIN_USER_IDS env var (comma-separated).
// Set ADMIN_USER_IDS in your .env file, e.g.: ADMIN_USER_IDS=id1,id2
export const ADMIN_USER_IDS: string[] = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
