import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../../services/api";
import cookie from "cookie";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";


interface userGoogleRegister {
  name: string;
  email: string;
  password: null;
  image_url: string;
  id: string;
}

const Auth = (request: NextApiRequest, response: NextApiResponse) => {

  return NextAuth(request, response, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ],
    callbacks: {
      async signIn({ user: { id, email, image, name }}) {
        
        let newUser: userGoogleRegister = {
          email,
          name,
          password: null,
          id,
          image_url: image
        };
  
        // const { data } = await api().post("/auth/signin/Google", { ...newUser });
        
        const req = await fetch(
          new Request(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signin/Google"`, {
            method: "POST",
            body: JSON.stringify({ ...newUser })
          })
        );
        const data = await req.json();
  
        console.log("logado com google: ", data);
  
        if (data.success) {
          console.log("setando o cookie");
          response.setHeader('Set-Cookie', [`app-token=${data.token}`]);
          console.log(response.req.headers);
        }

        return true;
      },

      async session({ session, user, token }) {
        session.user.id = token.sub;
  
        return session;
      }
    },
    secret: process.env.NEXT_PUBLIC_SECRET,
    pages: {
      error: "/login"
    }

  })
}

export default Auth;