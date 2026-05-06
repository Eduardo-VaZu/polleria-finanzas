import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }
  return secret;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

