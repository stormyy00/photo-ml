"use client";

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import Sidebar from "./sidebar";
import Navigation from "./navigation";

type props = {
  children: React.ReactNode;
  dehydratedState?: DehydratedState | null;
  sidebar?: boolean;
};

const Provider = ({ children, dehydratedState, sidebar }: props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {sidebar ? (
          <SidebarProvider>
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
              <Navigation />
              {children}
            </div>
          </SidebarProvider>
        ) : (
          children
        )}
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default Provider;
