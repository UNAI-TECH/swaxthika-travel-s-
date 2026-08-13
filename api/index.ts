import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Dynamically import server.ts (as compiled server.js) to catch any module-level evaluation crashes
    const { default: app } = await import("../server.js");
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({
      error: "Vercel Serverless Function runtime import error",
      message: err.message,
      stack: err.stack,
    });
  }
}
