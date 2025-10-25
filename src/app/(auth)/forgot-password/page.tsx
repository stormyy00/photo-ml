import { Suspense } from "react";
import ResetPassword from "@/components/auth/reset-password";
import Loading from "@/components/loading";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassword />
    </Suspense>
  );
};
export default page;

export const dynamic = "force-dynamic";
