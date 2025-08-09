import Image from "next/image";
import { Button } from "./ui/button";
import mock from "@/public/mock.svg";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-photo-white-200">
      <div className="flex max-w-7xl mx-auto px-4 items-center w-full">
        <div className="flex flex-col gap-4 text-photo-green-300">
          <h1 className="text-6xl font-bold leading-tight">
            Organize
            <br />
            Photos in
            <br />
            Seconds
          </h1>

          <p className="text-2xl font-medium text-gray-700 max-w-md">
            Sort your gallery by faces, dates, and scenes so you can focus on
            creating, not cleaning up
          </p>

          <div className="flex gap-4 mt-4">
            <Button className="bg-photo-green-300 text-lg text-white px-8 py-6 rounded-2xl font-medium">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="bg-photo-green-100 border-2 text-lg border-photo-green-300 text-photo-green-300 px-8 py-6 rounded-2xl font-medium hover:bg-photo-green-150"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-80 h-80 pb-2">
            <div className="absolute inset-0 -mt-4">
              <Image
                src={mock}
                alt="Photo 1"
                className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg transform  translate-x-64 translate-y-40 rotate-[60deg] border-2 border-photo-green-300"
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
            </div>
          </div>

          <div className="absolute -bottom-24 right-[53%] text-left">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              Built for
            </div>
            <div className="flex flex-col gap-1 text-photo-green-300 text-xl font-semibold">
              <p>Photographers</p>
              <p>Creators</p>
              <p>Self-starters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
