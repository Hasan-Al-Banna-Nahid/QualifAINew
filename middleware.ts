// middleware.ts (if you have one)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Make sure you're not redirecting all routes to home
  const path = request.nextUrl.pathname;

  // Don't add any automatic redirects to home unless for auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific routes if needed
  ],
};
