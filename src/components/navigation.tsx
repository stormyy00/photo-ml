"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/utils/auth-client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navigation = () => {
  const { data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const ITEMS = [
    { name: "About", href: "#about" },
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
  ];

  const router = useRouter();

  return (
    <div
      className={`flex sticky top-0 z-50 w-full bg-photo-gradient duration-500 transition-all
    ${isScrolled ? " bg-transparent" : "bg-photo-green-300"}
    `}
    >
      <div className="flex max-w-7xl mx-auto w-full py-5 px-6 rounded-b-3xl  backdrop-blur-md shadow-lg bg-photo-green-300 text-white-100 justify-between items-center">
        <div className="text-2xl font-bold text-photo-white-100">PhotoML</div>
        <div className="flex gap-5">
          {ITEMS.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="text-photo-white-100 hover:text-white-200 text-xl font-semibold"
            >
              {name}
            </Link>
          ))}
        </div>
        {session ? (
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard"
              className="bg-photo-green-100 border-2 px-4 py-1 font-medium rounded-2xl border-photo-green-300 text-photo-green-300"
            >
              Dashboard
            </Link>
            <Button
              variant={"outline"}
              className="bg-photo-green-100 border-2 rounded-2xl font-medium border-photo-green-300 text-photo-green-300"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant={"outline"}
            className="bg-photo-green-100 border-2 rounded-2xl font-medium border-photo-green-300 text-photo-green-300"
            onClick={() => router.push("/signin")}
          >
            Get Started
          </Button>
        )}
        {/* <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="bg-photo-green-100 border-2 px-4 py-1 font-medium rounded-2xl border-photo-green-300 text-photo-green-300"
          >
            Dashboard
          </Link>
          <Button
            variant={"outline"}
            className="bg-photo-green-100 border-2 rounded-2xl font-medium border-photo-green-300 text-photo-green-300"
          >
            Sign in
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Navigation;
