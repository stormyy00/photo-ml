import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "@radix-ui/react-tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const prompt = Prompt({
  subsets: ["latin"],
  variable: "--font-prompt",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Clarity",
  description: "Organize photos effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </Provider>
  );
}
