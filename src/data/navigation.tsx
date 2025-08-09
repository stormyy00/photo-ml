import { History, PictureInPicture, Settings, UserCircle } from "lucide-react";

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
};
