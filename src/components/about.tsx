const About = () => {
  return (
    <div
      id="about"
      className="relative w-full bg-photo-green-300 py-20 lg:py-32"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-photo-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-photo-green-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-6xl px-6 relative">
        <div className="text-center mb-16">
          <div className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Three simple steps to organized photos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-photo-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-photo-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Upload</h3>
            <p className="text-white/70 leading-relaxed">
              Drop your photos and we'll start analyzing them instantly
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-photo-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-photo-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Organize</h3>
            <p className="text-white/70 leading-relaxed">
              Machine learning sorts by faces, scenes, and events
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-photo-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                className="w-10 h-10 text-photo-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Download</h3>
            <p className="text-white/70 leading-relaxed">
              Get your photos back in neat, labeled folders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
