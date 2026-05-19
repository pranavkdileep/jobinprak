import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const adminJwt = request.cookies.get("adminJwt")?.value;

  if (!adminJwt) {
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(adminJwt, secret);
    if (payload.role !== "admin") {
      return redirectToLogin(request);
    }
  } catch {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/admin/((?!login).*)",
};
