import { apiResponse, apiError } from "@/lib/api-utils";
import { getSetupStatus } from "@/lib/env";

export async function GET() {
  try {
    const status = getSetupStatus();

    // Test database connectivity
    let dbConnected = false;
    try {
      const { db } = await import("@/lib/db");
      await db.execute("SELECT 1");
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    return apiResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        configured: status.database.configured,
      },
      auth: {
        secretConfigured: status.auth.secret,
        googleOAuth: status.auth.google,
      },
      ai: {
        configured: status.ai.configured,
        model: status.ai.model,
      },
      storage: {
        backend: status.storage.backend,
      },
      environment: status.app.env,
    });
  } catch (err) {
    return apiError(
      "Health check failed",
      500,
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
