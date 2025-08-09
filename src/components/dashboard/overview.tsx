import { Folder } from "lucide-react";
import React from "react";

const Overview = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="mb-4 p-4 bg-gray-100 rounded shadow">
            <div className="text-xl font-semibold flex gap-2 items-center">
              {" "}
              <Folder /> Overview {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
