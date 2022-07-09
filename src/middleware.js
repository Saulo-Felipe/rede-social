import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.SECRET || "secret";

export default async function middleware(req) {
  const token = await getToken({ req, secret });

  if (req.nextUrl.pathname.startsWith("/Login")) {
    if (token) {
      req.nextUrl.pathname = "/";
      return NextResponse.redirect(req.nextUrl);
    }
  } else {
    if (token) {
      try {
        return NextResponse.next();
      } catch (error) {
        req.nextUrl.pathname = "/Login";
        return NextResponse.redirect(req.nextUrl);
      }
    } else {
      req.nextUrl.pathname = "/Login";
      return NextResponse.redirect(req.nextUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/Profile', '/Login'],
}