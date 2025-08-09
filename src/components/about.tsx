import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import mock from "@/public/mock.svg";

const About = () => {
  return (
    <div
      id="about"
      className="relative min-h-screen w-full bg-photo-green-300 text-photo-white-200"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 mt-20">
        <div className="flex-1 flex items-start justify-between relative">
          <div className="relative w-80 h-80 pb-2">
            <div className="absolute inset-0 -mt-5">
              <Image
                src={mock}
                alt="Photo 1"
                className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg transform translate-x-2 translate-y-40 -rotate-[60deg] border-2 border-photo-green-300"
                priority
                draggable="false"
              />
              <Image
                src={mock}
                alt="Photo 2"
                className="absolute w-4/5 h-4/5 object-cover rounded-lg shadow-lg transform -rotate-[30deg] translate-x-28 translate-y-12 border-2 border-photo-green-300"
                priority
                draggable="false"
              />
              <Image
                src={mock}
                alt="Photo 3"
                className="absolute w-4/5 h-4/5 object-cover translate-x-60 rounded-lg shadow-lg border-2 border-photo-green-300"
                priority
                draggable="false"
              />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-center">
            <div className="font-bold text-2xl sm:text-3xl">Why Photo ML?</div>
            <p className="mt-3 max-w-lg text-center text-base font-medium md:text-left">
              Built for photographers, creators, and self-starters, sort your
              gallery by faces, dates, and scenes so you can focus on creating,
              not cleaning up
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-col w-full mx-auto items-end">
          <div className="text-center text-4xl font-bold w-3/5">Features</div>

          <div className="mt-6 grid grid-cols-1 items-start gap-3 md:grid-cols-[minmax(280px,360px)_auto_1fr]">
            <div className="mx-auto w-full max-w-[360px] space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-start rounded-xl bg-photo-white-200/10 text-photo-white-200 hover:bg-photo-white-200/20"
              >
                Download &amp; Upload from anywhere
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-xl bg-photo-white-200/10 text-photo-white-200 hover:bg-photo-white-200/20"
              >
                Automatic Organization
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-xl bg-photo-white-200/10 text-photo-white-200 hover:bg-photo-white-200/20"
              >
                100% Secure
              </Button>
            </div>

            <div className="hidden md:block h-full">
              <Separator
                orientation="vertical"
                className="mx-2 h-full bg-photo-white-200/20"
              />
            </div>

            <p className="mx-auto max-w-[42ch] text-center text-sm font-medium md:text-left">
              Built for photographers, creators, and self-starters, sort your
              gallery by faces, dates, and scenes so you can focus on creating,
              not cleaning up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
