"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navigation = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => setIsScrolled(window.scrollY > 20);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const ITEMS = [
    { name: "About", href: "#about" },
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
  ];

  const router = useRouter();

  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4">
      <div
        className={`max-w-6xl mx-auto rounded-full transition-all duration-500 ${
          isScrolled
            ? "bg-photo-green-300/95 backdrop-blur-xl shadow-lg shadow-photo-green-300/30"
            : "bg-photo-green-300 backdrop-blur-md shadow-md shadow-photo-green-300/20"
        }`}
      >
        <div className="flex items-center px-6 py-4">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-photo-green-300 font-bold text-lg">
                  P
                </span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PhotoML
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {ITEMS.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                className="px-4 py-2 text-white/90 hover:text-white font-medium text-sm rounded-full hover:bg-white/10 transition-all duration-300"
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="flex-1 flex justify-end">
            {session ? (
              <div className="flex gap-2 items-center">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  className="rounded-full bg-white text-photo-green-300 hover:bg-white/90 font-medium text-sm px-5 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                className="rounded-full bg-white text-photo-green-300 hover:bg-white/90 font-medium text-sm px-6 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => router.push("/signin")}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
