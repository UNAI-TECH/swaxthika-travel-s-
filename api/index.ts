import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { default: app } = await import("../server");
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({
      error: "Vercel Serverless Function import error",
      message: err.message,
      stack: err.stack,
    });
  }
}
