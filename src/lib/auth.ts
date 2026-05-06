import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

const AUTH_COOKIE_NAME = "auth_token";

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getAuthenticatedUser() {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}

