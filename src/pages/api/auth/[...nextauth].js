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
    async signIn({ user }) {
      const [result] = await sequelize.query(`
        SELECT * FROM "User" WHERE email = '${user.email}';
      `);

      console.log(user);

      if (result.length === 0) {
        await sequelize.query(`
          INSERT INTO "User" (user_id, username, email, image_url)
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
  },
  jwt: { encryption: true },
  secret: process.env.SECRET,
});
