import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example middleware for authentication or other global checks
  // This is a placeholder; you can expand this as needed
  return NextResponse.next();
}

export const config = {
  // Matcher for paths where middleware should run
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)" 
  ],
};
