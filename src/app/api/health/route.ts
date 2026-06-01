import { pingDB } from "@/lib/db";
import { success } from "@/lib/api/response";
import { withErrorHandler } from "@/lib/api/handler";

export const GET = withErrorHandler(async () => {
  const dbConnected = await pingDB();

  return success({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: dbConnected ? "connected" : "disconnected",
  });
});
