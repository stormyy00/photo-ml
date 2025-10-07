import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

type ResetPasswordEmailProps = {
  resetLink?: string;
  userEmail?: string;
};

const ResetPasswordEmail = ({
  resetLink,
  userEmail,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Ttickle password</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                "green-100": "#E5FEF3",
                "green-200": "#6CAD9D",
                "green-300": "#09392D",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-10 px-5 max-w-2xl">
            <Section className="bg-white rounded-lg p-10 shadow-md">
              <div className="flex items-center gap-2 text-3xl font-bold mb-2 text-green-300">
                Photo ML
              </div>

              <Heading className="text-2xl font-semibold text-green-300 mb-4 mt-8">
                Reset Your Password
              </Heading>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                We received a request to reset the password for your Photo ML
                account associated with <strong>{userEmail}</strong>.
              </Text>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Click the button below to create a new password. This link will
                expire in 1 hour for security purposes.
              </Text>

              <Section className="mb-6">
                <Link
                  href={resetLink}
                  className="inline-block bg-green-200 text-white px-8 py-3 rounded-md font-semibold text-base no-underline"
                >
                  Reset Password
                </Link>
              </Section>

              <Text className="text-base text-gray-600 mb-4">
                Or copy and paste this link into your browser:
              </Text>

              <Section className="bg-green-300 p-4 rounded-md mb-6 border border-green-100">
                <Text className="text-sm text-green-300 break-all m-0">
                  {resetLink}
                </Text>
              </Section>

              <Section className="bg-orange-50 border-l-4 border-ttickles-orange p-4 rounded-md mb-6">
                <Text className="text-sm text-gray-700 mb-2 font-semibold">
                  ⚠️ Security Notice
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  If you didn't request a password reset, please ignore this
                  email or contact our support team if you have concerns about
                  your account security.
                </Text>
                <Text className="text-sm text-gray-600 mb-0">
                  Your password will remain unchanged until you create a new one
                  using the link above.
                </Text>
              </Section>

              <Section className="mt-8 pt-6 border-t border-gray-200">
                <Text className="text-sm text-gray-400 leading-relaxed mb-2">
                  <strong className="text-gray-600">Photo ML</strong> -
                  AI-Powered Photo Management
                </Text>
                <Text className="text-sm text-gray-400 leading-relaxed mb-0">
                  This is an automated message. Please do not reply to this
                  email.
                </Text>
              </Section>

              <Text className="text-center text-xs text-gray-400 mt-6 mb-0">
                © 2025 Photo ML. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
