import { PrismaAdapter } from "@auth/prisma-adapter";
import CryptoJS from "crypto-js";
import SHA256 from "crypto-js/sha256";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import prisma from "~~/prisma/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter, // Casting to prevent type errors
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        const emailHash = SHA256(profile.sub).toString(CryptoJS.enc.Hex);
        const defaultImage = encodeURIComponent(`https://api.dicebear.com/9.x/adventurer/png/seed=${emailHash}`);

        const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;

        return {
          id: profile.sub,
          name: profile.name || null,
          email: profile.email || null,
          image: gravatarImage, // Use the generated gravatar image
        } as { id: string | number | null; name: string | null; email: string | null; image: string | null };
      },
    },
  ],
  callbacks: {
    async session(session: any) {
      console.log("session", session);
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
