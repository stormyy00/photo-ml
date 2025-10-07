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

type EmailVerificationProps = {
  verificationLink?: string;
  userEmail?: string;
  userName?: string;
};

const EmailVerificationEmail = ({
  verificationLink,
  userEmail,
  userName,
}: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your Ttickle email address</Preview>
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
                Verify Your Email Address
              </Heading>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Hi {userName || "there"},
              </Text>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Thanks for signing up for Ttickle! We're excited to help you
                amplify your social outreach and create compelling content for
                your cause.
              </Text>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                To complete your registration and start using Ttickle, please
                verify your email address by clicking the button below:
              </Text>

              <Section className="mb-6">
                <Link
                  href={verificationLink}
                  className="inline-block bg-green-200 text-white px-8 py-3 rounded-md font-semibold text-base no-underline"
                >
                  Verify Email Address
                </Link>
              </Section>

              <Text className="text-base text-gray-600 mb-4">
                Or copy and paste this link into your browser:
              </Text>

              <Section className="bg-green-300 p-4 rounded-md mb-6 border border-green-200">
                <Text className="text-sm text-white break-all m-0">
                  {verificationLink}
                </Text>
              </Section>

              <Section className="bg-orange-50 border-l-4 border-ttickles-orange p-4 rounded-md mb-6">
                <Text className="text-sm text-gray-700 mb-2 font-semibold">
                  ⏱️ Link Expiration
                </Text>
                <Text className="text-sm text-gray-600 mb-0">
                  This verification link will expire in 24 hours. If it expires,
                  you can request a new verification email from your account
                  settings.
                </Text>
              </Section>

              <div className="text-sm text-gray-500 mb-6">
                <Text className="mb-2">
                  This verification was requested for{" "}
                  <strong>{userEmail}</strong>
                </Text>
                <Text className="mb-0">
                  If you didn't create an account with Ttickle, you can safely
                  ignore this email.
                </Text>
              </div>

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

export default EmailVerificationEmail;
