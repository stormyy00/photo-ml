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

type WelcomeEmailProps = {
  userName?: string;
  userEmail?: string;
  dashboardLink?: string;
};

const WelcomeEmail = ({
  userName,
  userEmail,
  dashboardLink,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Photo ML - Start organizing your photos with AI
      </Preview>
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
                Welcome to Photo ML, {userName}! 🎉
              </Heading>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                We're thrilled to have you on board! Photo ML uses cutting-edge
                AI to help you organize, search, and manage your photos
                effortlessly.
              </Text>

              <Section className="bg-green-100 p-6 rounded-md mb-6 border border-green-100">
                <Heading className="text-lg font-semibold text-green-300 mt-0 mb-3">
                  Get Started in 3 Easy Steps:
                </Heading>
                <Text className="text-sm text-gray-600 mb-2">
                  <strong>1. Upload your photos</strong> - Drag and drop or
                  select from your device
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  <strong>2. Let AI do the work</strong> - Our AI will
                  automatically tag and categorize
                </Text>
                <Text className="text-sm text-gray-600 mb-0">
                  <strong>3. Search and organize</strong> - Find any photo
                  instantly with natural language
                </Text>
              </Section>

              {dashboardLink && (
                <Section className="mb-6">
                  <Link
                    href={dashboardLink}
                    className="inline-block bg-green-200 text-white px-8 py-3 rounded-md font-semibold text-base no-underline"
                  >
                    Go to Dashboard
                  </Link>
                </Section>
              )}

              <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                Need help getting started? Check out our{" "}
                <Link href="#" className="text-green-200 underline">
                  quick start guide
                </Link>{" "}
                or reach out to our support team anytime.
              </Text>

              <div className="text-sm text-gray-500 mb-6">
                <Text className="mb-0">
                  This welcome email was sent to <strong>{userEmail}</strong>
                </Text>
              </div>

              <Section className="mt-8 pt-6 border-t border-gray-200">
                <Text className="text-sm text-gray-400 leading-relaxed mb-2">
                  <strong className="text-gray-600">Photo ML</strong> - Photo
                  Management
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

export default WelcomeEmail;
