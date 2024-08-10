import { PrismaAdapter } from "@auth/prisma-adapter";
import CryptoJS from "crypto-js";
import SHA256 from "crypto-js/sha256";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import prisma from "~~/prisma/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter, // this cast is required to prevent type errors, see https://github.com/nextauthjs/next-auth/issues/6106
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
        profile.sub;
        const options = `seed=${emailHash}`;
        const defaultImage = encodeURIComponent(`https://api.dicebear.com/9.x/adventurer/png/${options}`);

        const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
        // https://www.gravatar.com/avatar/00000000000000000000000000000000?d=https%3A%2F%2Fapi.dicebear.com%2F9.x%2Florelei%2Fpng%2Fseed%253D00000000000000000000000000000000

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: gravatarImage, // Fallback random avatar image
          // verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  debug: process.env.NODE_ENV === "development",
};
