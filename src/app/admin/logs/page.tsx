"use client";

import Dashboard from "@/components/admin/dashboard";
import { LOG_FILTERS } from "@/data/filters";
import { COLUMNS } from "@/data/logs";
import { MOCK_LOGS } from "@/data/mock-logs";
import React from "react";

const page = () => {
  return (
    <div className="flex h-full flex-col gap-3 py-4 font-poppins">
      <Dashboard
        // searchParams={searchParams}
        title="Logs"
        columns={COLUMNS}
        initialData={MOCK_LOGS}
        queryKey={["logs"]}
        queryFn={async () => MOCK_LOGS}
        searchKeys={["service", "message"]}
        filters={LOG_FILTERS}
      />
    </div>
  );
};

export default page;
