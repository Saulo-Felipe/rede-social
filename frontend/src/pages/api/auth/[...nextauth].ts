import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../../services/api";
import { sequelize } from "../database/connect";


interface userGoogleRegister {
  name: string;
  email: string;
  password: null;
  image_url: string;
  id: string;
}


export default NextAuth({
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
    async signIn({ user, account, profile, email, credentials }) {
      
      let newUser: userGoogleRegister = {
        email: user.email,
        name: user.image,
        password: null,
        id: user.id,
        image_url: user.image
      };

      const { data } = await api.put("/user/google", { ...newUser });
      

      return data.success == true;
    },
    async session({ session, user, token }) {
      session.user.id = token.sub;

      return session;
    }
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
});