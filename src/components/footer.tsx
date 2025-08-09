import React from "react";

const Footer = () => {
  return (
    <div className=" w-full min py-10 bg-photo-green-300 text-photo-white-100">
      <div className="max-w-8xl flex justify-between items-center mx-auto px-6">
        <div className="flex flex-col items-start justify-center mb-4">
          <div className="text-2xl font-bold">PhotoML</div>
          <p className="text-lg">Your AI-powered photo management solution</p>
        </div>

        <div className="flex justify-center items-center">
          <p className="text-sm">© 2025 PhotoML. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
