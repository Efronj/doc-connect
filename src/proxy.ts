import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");
    
    console.log(`[PROXY] Path: ${req.nextUrl.pathname}, Auth: ${isAuth}, Dept: ${token?.department}`);

    if (isAuth && !token.department && !isOnboardingPage) {
      console.log(`[PROXY] Redirecting to onboarding...`);
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

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
