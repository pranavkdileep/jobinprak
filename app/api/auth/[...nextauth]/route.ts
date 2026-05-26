import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { encrypt } from "@/actions/encription/aes";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.send",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) return false;

      const db = await connectToDatabase();
      const user = await db
        .collection("users")
        .findOne({ email: profile.email });

      if (!user) {
        return `/signup?email=${encodeURIComponent(profile.email)}`;
      }

      if (account?.access_token) {
        await db.collection("users").updateOne(
          { email: profile.email },
          {
            $set: {
              googleAccessToken: encrypt(account.access_token),
              googleRefreshToken: account.refresh_token
                ? encrypt(account.refresh_token)
                : undefined,
              googleExpiryDate: account.expires_at
                ? account.expires_at * 1000
                : undefined,
            },
          }
        );
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
