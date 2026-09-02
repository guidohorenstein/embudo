import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE = "noir_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("Falta la variable de entorno SESSION_SECRET");
  return new TextEncoder().encode(value);
}

export async function verifyPassword(password: string) {
  const raw = process.env.ADMIN_PASSWORD_HASH;
  if (!raw) throw new Error("Falta la variable de entorno ADMIN_PASSWORD_HASH");

  // El hash se guarda en base64 (ver scripts/hash-password.mjs): un hash bcrypt
  // crudo contiene "$", que los archivos .env interpretan como variable.
  // Igual se acepta el hash tal cual por si se pego a mano.
  const hash = raw.startsWith("$2") ? raw : Buffer.from(raw, "base64").toString("utf8");
  if (!hash.startsWith("$2")) throw new Error("ADMIN_PASSWORD_HASH no es un hash valido");

  return bcrypt.compare(password, hash);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
