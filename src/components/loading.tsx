import { Spinner } from "./ui/spinner";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-photo-green-100/30 via-white to-white">
      <p className="text-3xl font-bold text-photo-green-300">Loading</p>
      <Spinner className="mt-4 text-photo-green-300" />
    </div>
  );
};

export default Loading;
