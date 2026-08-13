import app from "../server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({
      error: "Vercel Serverless Function execution error",
      message: err.message,
      stack: err.stack,
    });
  }
}
