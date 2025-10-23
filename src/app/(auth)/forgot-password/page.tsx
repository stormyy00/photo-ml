import { Suspense } from "react";
import ResetPassword from "@/components/auth/reset-password";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};
export default page;

export const dynamic = "force-dynamic";
