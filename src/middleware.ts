import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "noir_session";

async function isValid(token?: string) {
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SESSION_SECRET),
    );
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authenticated = await isValid(request.cookies.get(COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (authenticated) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!authenticated) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
