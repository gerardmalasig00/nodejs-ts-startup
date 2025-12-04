import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { Role } from "../users/user.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../services/jwtService";
import { config } from "../../core/config";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { sub: user._id, roles: user.roles };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user._id });

  // Persist refresh token for logout/invalidation
  user.refreshTokens.push(refreshToken);
  await user.save();

  // Send refresh token as httpOnly cookie (recommended)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // align with REFRESH_TOKEN_EXPIRES_IN
  });

  return res.json({ accessToken });
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const userId = payload.sub;
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: "User not found" });

  // ensure token is still valid (not logged out)
  if (!user.refreshTokens.includes(token)) {
    return res.status(401).json({ message: "Refresh token revoked" });
  }

  const newAccess = signAccessToken({ sub: user._id, roles: user.roles });
  const newRefresh = signRefreshToken({ sub: user._id });

  // rotate refresh tokens (remove old, add new)
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefresh);
  await user.save();

  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json({ accessToken: newAccess });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    try {
      const payload: any = verifyRefreshToken(token);
      const user = await User.findById(payload.sub);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    } catch (err) {
      // ignore invalid token
    }
  }

  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
}
