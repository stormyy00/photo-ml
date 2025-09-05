import { jwtClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [jwtClient(), magicLinkClient()],
});

export const { useSession, signIn, signUp, signOut, magicLink } = authClient;
