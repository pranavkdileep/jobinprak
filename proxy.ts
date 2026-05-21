import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("session")?.value;
  const adminToken = request.cookies.get("adminJwt")?.value;

  const isAuthenticated = !!(sessionToken || adminToken);

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dash", request.url));
  }

  if (pathname.startsWith("/dash")) {
    return handleDashAuth(request);
  }

  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  return NextResponse.next();
}

async function handleDashAuth(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(sessionToken, secret);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

async function handleAdminAuth(request: NextRequest) {
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
  matcher: [
    "/login",
    "/signup",
    "/dash/:path*",
    "/admin/((?!login).*)",
  ],
};
