import Reset from "@/components/auth/reset";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reset />
    </Suspense>
  );
};

export default page;

export const dynamic = "force-dynamic";
