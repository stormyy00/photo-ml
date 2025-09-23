"use server";

import Dashboard from "@/components/admin/dashboard";
import { COLUMNS } from "@/data/users";
import { getUsers } from "@/db/queries/admin";
import { USER_FILTERS } from "@/data/filters";

const page = async () => {
  const users = await getUsers();

  return (
    <div className="flex h-full flex-col gap-3 py-4 font-poppins">
      <Dashboard
        title="Admins"
        columns={COLUMNS}
        initialData={users}
        queryKey={["users"]}
        queryFn={getUsers}
        searchKeys={["name", "email"]}
        filters={USER_FILTERS}
        filterKey="tier"
      />
    </div>
  );
};

export default page;
