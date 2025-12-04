import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth";

export function requireRole(allowed: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const roles = req.user?.roles || [];
    const ok = roles.some((r) => allowed.includes(r));
    if (!ok) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
