import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sequelize } from "../database/connect";


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
      const [result] = await sequelize.query(`
        SELECT * FROM "User" WHERE email = '${user.email}';
      `);
      
      if (result.length === 0) {
        await sequelize.query(`
          INSERT INTO "User" (id, username, email, image_url)
          VALUES (
            '${user.id}',
            '${user.name}',
            '${user.email}',
            '${user.image}'
          );
        `);
      }

      return true;
    },
    async session({ session, user, token }) {
      session.user.id = token.sub;

      return session;
    }
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
});