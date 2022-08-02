import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./services/getUser";

const secret = process.env.NEXT_PUBLIC_SECRET || "secret";

interface IsAuthenticated {
  isAuthenticated: boolean;
}

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("app-token") || "";

  const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/authenticated`, {
    headers: {
      "app-token": token
    }
  });


  // const {isAuthenticated}: IsAuthenticated = await request.json();

  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat", "/profile/:path*", "/search/:path*"],
}