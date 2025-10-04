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

type MagicLinkEmailProps = {
  magicLink?: string;
  userEmail?: string;
};

const MagicLinkEmail = ({ magicLink, userEmail }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Photo ML - Your magic link is ready</Preview>
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
                {/* <span className="w-8 h-8 bg-green-200 rounded flex items-center justify-center text-white text-xl">
                  📸
                </span> */}
                Photo ML
              </div>

              <Heading className="text-2xl font-semibold text-green-300 mb-4 mt-8">
                Sign in to Photo ML
              </Heading>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Click the button below to securely sign in to your Photo ML
                account. This link will expire in 15 minutes for security
                purposes.
              </Text>

              <Section className="mb-6">
                <Link
                  href={magicLink}
                  className="inline-block bg-green-200 text-white px-8 py-3 rounded-md font-semibold text-base no-underline"
                >
                  Sign In to Photo ML
                </Link>
              </Section>

              <Text className="text-base text-gray-600 mb-4">
                Or copy and paste this link into your browser:
              </Text>

              <Section className="bg-green-100 p-4 rounded-md mb-6 border border-green-100">
                <Text className="text-sm text-gray-500 break-all m-0">
                  {magicLink}
                </Text>
              </Section>

              <div className="text-sm text-gray-500 mb-6">
                <Text className="mb-2">
                  This sign-in link was requested for{" "}
                  <strong>{userEmail}</strong>
                </Text>
                <Text className="mb-0">
                  If you didn{"'s"}t request this email, you can safely ignore
                  it.
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

export default MagicLinkEmail;
