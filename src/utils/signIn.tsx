import { ErrorContext } from "better-auth/react";
import { authClient } from "./auth-client";

const SignInProvider = async (provider: string) =>
  await authClient.signIn.social(
    {
      provider: provider,
      callbackURL: `/`,
    },
    {
      onSuccess: async () => {},
      onError: (ctx: ErrorContext) => {
        alert({
          title: "Something went wrong",
          description: ctx.error.message ?? "Something went wrong.",
          variant: "destructive",
        });
      },
    },
  );

export default SignInProvider;
