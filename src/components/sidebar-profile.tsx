import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

type props = {
  email: string;
  name: string;
  image: string | null;
  isLoading?: boolean;
  signout: () => void;
};

const SidebarProfile = ({ name, email, image, signout }: props) => {
  const { isMobile, open } = useSidebar();
  const router = useRouter();

  if (!name && !email) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full flex items-center py-2 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback className="rounded-lg bg-white/20 text-white">
                  {name?.charAt(0) || email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-medium">{name || email}</span>
                  {name && (
                    <span className="truncate text-xs text-white/70">
                      {email}
                    </span>
                  )}
                </div>
              )}
              {open && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image || undefined} alt={name} />
                  <AvatarFallback className="rounded-lg bg-gray-100 text-gray-600">
                    {name?.charAt(0) || email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name || email}</span>
                  {name && (
                    <span className="truncate text-xs text-gray-500">
                      {email}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarProfile;
