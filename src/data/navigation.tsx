import { History, PictureInPicture, Settings } from "lucide-react";

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
