import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";
import { jwt, magicLink } from "better-auth/plugins";
import { headers } from "next/headers";
import { db } from "@/db";
import { users, accounts, sessions, verification, jwks } from "@/db/schema";
import { sendEmail, sendMagicLinkEmail } from "./email";

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
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    signUp: {
      sendWelcomeEmail: async ({
        user,
      }: {
        user: { email: string; name?: string };
      }) => {
        await sendEmail({
          to: user.email,
          subject: "Welcome to our platform!",
          text: `Hi ${user.name}, welcome to our platform!`,
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
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
  plugins: [
    jwt(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({
          to: email,
          subject: "Verify your Photo ML email",
          magicLink: url,
        });
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 12, // 12 hours
    updateAge: 60 * 60 * 24 * 3, // 3 days (every 3 days the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  baseURL: process.env.BETTER_AUTH_URL as string,
});

export const authenticate = async () => {
  const session = await getServerSession();
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

export const getServerSession = async () => {
  return await auth.api.getSession({
    headers: headers(),
  });
};

export const getToken = async () => {
  return await auth.api.getToken({
    headers: await headers(),
  });
};
