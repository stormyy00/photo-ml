import {
  History,
  PictureInPicture,
  Settings,
  UserCircle,
  BarChart3,
} from "lucide-react";

interface Tab {
  name: string;
  link: string;
  icon: JSX.Element;
  requiresOrg?: boolean;
  requiresOwner?: boolean;
  subtabs?: Tab[];
}

interface Collapsible {
  expand: boolean;
  tabs: Tab[];
}
type Tabs = Record<string, Collapsible>;

export const TABS: Tabs = {
  dashboard: {
    expand: true,
    tabs: [
      {
        name: "Organize",
        link: "/dashboard",
        icon: <PictureInPicture />,
      },
      {
        name: "Subjects",
        link: "/dashboard/subjects",
        icon: <UserCircle />,
      },
      {
        name: "Analytics",
        link: "/dashboard/analytics",
        icon: <BarChart3 />,
      },
      {
        name: "History",
        link: "/dashboard/history",
        icon: <History />,
      },
      {
        name: "Settings",
        link: "/dashboard/settings",
        icon: <Settings />,
      },
    ],
  },
  admin: {
    expand: false,
    tabs: [
      {
        name: "Users",
        link: "/admin/users",
        icon: <UserCircle />,
      },
      {
        name: "Services",
        link: "/admin/services",
        icon: <PictureInPicture />,
      },
      {
        name: "Logs",
        link: "/admin/logs",
        icon: <History />,
      },
    ],
  },
};
