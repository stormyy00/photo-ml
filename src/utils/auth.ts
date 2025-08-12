import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";
import { jwt } from "better-auth/plugins";
import { headers } from "next/headers";
import { db } from "@/db";
import { users, accounts, sessions, verification, jwks } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verification,
      jwks: jwks,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      mapProfileToUser: (profile) => ({
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        image: profile.picture,
        role: {},
      }),
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
  baseURL: process.env.BETTER_AUTH_URL as string,
});

export const authenticate = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user || !session?.user?.email) {
    return {
      message: "Invalid Authentication",
      auth: 401,
    };
  }
  return {
    uid: session.user.id,
    user: session.user,
    message: null,
    auth: 200,
  };
};

export const getSesrverSession = async () => {
  return await auth.api.getSession({
    headers: headers(),
  });
};

export const getToken = async () => {
  return await auth.api.getToken({
    headers: await headers(),
  });
};
