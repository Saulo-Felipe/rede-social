import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_PUBLIC_SECRET || "secret";

export default async function middleware(req) {
  const token = await getToken({ req, secret });

  if (req.nextUrl.pathname.startsWith("/login")) {
    if (token) {
      req.nextUrl.pathname = "/";
      return NextResponse.redirect(req.nextUrl);
    }
  } else {
    if (token) {
      NextResponse.next();
      return;
    } else {
      req.nextUrl.pathname = "/login";
      NextResponse.redirect(req.nextUrl);
      return;
    }
  }
  
  return NextResponse.next();
}
