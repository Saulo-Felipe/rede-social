import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_PUBLIC_SECRET || "secret";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (req.nextUrl.pathname.startsWith("/login")) {
    if (token) {
      req.nextUrl.pathname = "/";
      return NextResponse.redirect(req.nextUrl);
    }
  } else {
    if (token) {
      return NextResponse.next();
    } else {
      req.nextUrl.pathname = "/login";
      NextResponse.redirect(req.nextUrl);
      
    }
  }
  
  return NextResponse.next();
}
