import { NextRequest, NextResponse } from 'next/server'
import { api } from './services/api';



interface MiddlewareVerifyTokenBody {
  success?: boolean;
  logout?: boolean;
}

async function verifyToken(token: string) {
  const url = process.env.NEXT_PUBLIC_SERVER_URL+"/auth/verify-token";

  const response = await fetch(url, {
    headers: new Headers({
      "app-token": token
    })
  });

  return await response.json();
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('app-token') || "";

  const action = verifyToken(token).then((response: MiddlewareVerifyTokenBody) => {
    if (response.success) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  });

  return action;
}

export const config = {
  matcher: ["/", "/chat", "/profile/:userID*", "/search/:UserName*"],
};