import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/utils/auth";
import Error from "./error";
import { getRole } from "@/db/queries/admin";

const ProtectedPage = async ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "admin" | "user";
}) => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/signin");
  }
  const result = await getRole(session?.user?.id || "");
  const userRole = result[0]?.role;

  // Note: Role checking would need to be implemented based on your requirements
  // For now, we just check if user is authenticated
  if (role !== userRole) {
    return (
      <Error
        code={403}
        name="Access Denied"
        message="You don't have permission to access this page. Please contact an administrator if you believe this is an error."
        dev={`User with role '${String(userRole)}' attempted to access restricted area`}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
