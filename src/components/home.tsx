import Image from "next/image";
import { Button } from "./ui/button";
import mock from "@/public/mock.svg";
import logo from "@/public/howard.svg";
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="relative isolate">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-photo-green-300 leading-[1.05] animate-fade-up">
                Organize photos in seconds.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
                Sort your gallery by faces, dates, and scenes so you can focus
                on creating, not cleaning up
              </p>
              <div className="flex flex-wrap gap-3 pt-2 animate-fade-up">
                <Button className="rounded-xl h-12 px-6 text-base bg-photo-green-300 text-white hover:bg-photo-green-500">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl h-12 px-6 text-base"
                >
                  View Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-6 opacity-90">
                <Image
                  src={logo}
                  alt="Trusted logo"
                  width={96}
                  height={28}
                  className=" opacity-70"
                />
                <span className="text-sm text-muted-foreground">
                  Trusted by creators and teams
                </span>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
