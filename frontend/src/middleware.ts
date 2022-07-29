import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_PUBLIC_SECRET || "secret";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat", "/profile/:path*", "/search/:path*"],
}