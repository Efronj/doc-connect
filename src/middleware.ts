import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;
  const isOnboardingPage = pathname.startsWith("/onboarding");
  const isLoginPage = pathname.startsWith("/login");
  const isSignupPage = pathname.startsWith("/signup");
  const isForgotPasswordPage = pathname.startsWith("/forgot-password");

  console.log(`[MIDDLEWARE] Path: ${pathname}, Auth: ${isAuth}, Dept: ${token?.department}`);

  // 1. If not authenticated and trying to access protected route -> Login
  if (!isAuth && !isLoginPage && !isSignupPage && !isForgotPasswordPage && !pathname.startsWith("/api/auth")) {
    console.log(`[MIDDLEWARE] Not auth, redirecting to login...`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. If authenticated but missing department and not on onboarding -> Onboarding
  if (isAuth && !token?.department && !isOnboardingPage) {
    console.log(`[MIDDLEWARE] Auth but no department, redirecting to onboarding...`);
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 3. If authenticated and has department and trying to access onboarding -> Home
  if (isAuth && token?.department && isOnboardingPage) {
    console.log(`[MIDDLEWARE] Auth and has department, redirecting from onboarding to home...`);
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const proxy = middleware;

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/search/:path*",
    "/settings/:path*"
  ]
};
