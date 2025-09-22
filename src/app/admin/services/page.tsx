"use client";

import Dashboard from "@/components/admin/dashboard";
import { COLUMNS } from "@/data/users";
import React from "react";

const page = async () => {
  return (
    <div className="flex h-full flex-col gap-3 py-4 font-poppins">
      <Dashboard
        // searchParams={searchParams}
        title="Services Status"
        columns={COLUMNS}
        queryKey={["services"]}
        queryFn={async () => []}
        initialData={[]}
        searchKeys={[]}
      />
    </div>
  );
};

export default page;
