import { Button } from "./ui/button";
import PhotoSortAnimation from "./animation";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-photo-green-100/30 via-white to-white">
      <div className="relative isolate">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-10 w-72 h-72 bg-photo-green-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-photo-green-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-7">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-photo-green-300 leading-[1.08]">
                Organize photos{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10">in seconds</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8 Q50 2, 100 7 T198 8"
                      fill="none"
                      stroke="rgb(108, 173, 157)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-photo-green-300/70 max-w-xl leading-relaxed">
                Sort your gallery by faces, dates, and scenes so you can focus
                on creating, not cleaning up
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button className="group rounded-full h-12 px-7 text-base font-semibold bg-photo-green-300 text-white hover:bg-photo-green-300/90 shadow-lg shadow-photo-green-300/25 hover:shadow-xl hover:shadow-photo-green-300/35 transition-all duration-300">
                  Try It Out Now
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-12 px-7 text-base font-semibold border-2 border-photo-green-300/40 text-photo-green-300 hover:border-photo-green-300 hover:bg-photo-green-100/40 transition-all duration-300"
                >
                  View Demo
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-photo-green-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-photo-green-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-photo-green-300">
                    Face recognition
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-photo-green-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-photo-green-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-photo-green-300">
                    Scene detection
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-photo-green-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-photo-green-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-photo-green-300">
                    Auto folders
                  </span>
                </div>
              </div>
            </div>
            <div className="relative w-full h-80 pb-2 mx-auto lg:mx-0">
              {/* <div className="absolute inset-0 -mt-4">
                <Image
                  src={mock}
                  alt="Photo 1"
                  className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg transform translate-x-64 translate-y-40 rotate-[60deg] border-2 border-photo-green-300"
                  priority
                  draggable="false"
                />
                <Image
                  src={mock}
                  alt="Photo 2"
                  className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg transform rotate-[30deg] translate-x-40 translate-y-12 border-2 border-photo-green-300"
                  priority
                  draggable="false"
                />
                <Image
                  src={mock}
                  alt="Photo 3"
                  className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg border-2 border-photo-green-300"
                  priority
                  draggable="false"
                />
              </div> */}
              <PhotoSortAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
