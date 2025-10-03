import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-photo-green-300 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold">PhotoML</span>
            </div>
            <p className="text-white/80 text-sm">
              Your instant photo management solution
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <a
              href="#about"
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              className="text-white/80 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="/privacy"
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/70 text-sm">
              © 2025 PhotoML. All rights reserved.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-center text-white/60 text-xs">
            Made with care for photographers and creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
