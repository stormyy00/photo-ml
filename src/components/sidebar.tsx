"use client";

import { TABS } from "@/data/navigation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

const Navigation = () => {
  const path = usePathname().split("/");
  const navParent = path[1];
  const router = useRouter();

  const NAVTABS = TABS[navParent]?.tabs ?? [];
  const generalPath = `${path.slice(0, 2).join("/")}/dashboard/${path.slice(3).join("/")}`;

  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={`
        h-screen bg-photo-green-200 text-white border-0 flex justify-between rounded-r-2xl shadow-lg transition-all z-30
        ${open ? "" : "w-[70px] min-w-[56px]"}
      `}
    >
      <SidebarHeader className={`py-4 px-3 ${!open ? "items-center" : ""}`}>
        <div
          className={`flex items-center gap-3 mb-2 ${!open && "justify-center"}`}
        >
          <div className="bg-white rounded-xl h-10 w-10 flex items-center justify-center shadow-md flex-shrink-0">
            <Camera className="h-5 w-5 text-photo-green-200" />
          </div>
          {open && (
            <span className="font-bold text-base text-white">Photo ML</span>
          )}
        </div>
        {open && (
          <div className="text-xs text-white/70">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex-1 justify-start px-2 py-2">
        <div className="flex flex-col gap-1">
          {NAVTABS.map(({ link, name, icon }, idx) => (
            <button
              key={idx}
              onClick={() => router.push(link)}
              className={`
                flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
                ${
                  generalPath === link
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
                ${!open && "justify-center px-2"}
              `}
            >
              <span className="flex-shrink-0">{icon}</span>
              {open && <span className="flex-1 text-left">{name}</span>}
            </button>
          ))}
        </div>
      </SidebarContent>

      <SidebarSeparator className="mx-3 my-2 bg-white/20" />

      <SidebarFooter className="px-3 py-3 flex flex-col gap-1">
        <SidebarLink
          open={open}
          href="/"
          icon={<Home size={18} />}
          label="Back to Home"
        />
        <button
          onClick={toggleSidebar}
          className={`
            flex items-center justify-${open ? "start" : "center"} 
            py-2.5 px-3 rounded-lg
            text-white/80 hover:text-white hover:bg-white/10
            transition-all duration-200 ease-in-out
            text-sm font-medium
            ${!open ? "gap-0" : "gap-3"}
          `}
        >
          <SidebarTrigger className="hover:bg-transparent hover:text-white p-0 h-5 w-5 flex-shrink-0" />
          {open && <span>Close</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

function SidebarLink({
  open,
  href,
  icon,
  label,
}: {
  open: boolean;
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium 
        transition-all duration-200 ease-in-out text-sm
        text-white/80 hover:text-white hover:bg-white/10
        ${!open && "justify-center px-2"}
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {open && <span className="flex-1 text-left">{label}</span>}
    </Link>
  );
}

export default Navigation;
