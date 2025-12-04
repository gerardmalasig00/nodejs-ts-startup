import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../services/jwtService";

export interface AuthRequest extends Request {
  user?: { sub: string; roles: string[] };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token || "") as any;
    req.user = { sub: payload.sub, roles: payload.roles || [] };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
