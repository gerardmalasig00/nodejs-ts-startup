import jwt from "jsonwebtoken";
import { config } from "../core/config";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN as any,
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as any,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as any;
}
