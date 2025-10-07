import Fault from "@/utils/error";

const Error = ({ code, name, message, dev }: Fault) => {
  return (
    <div className="fixed flex h-screen w-screen flex-col items-center justify-center min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white ">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-photo-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-photo-green-200/20 rounded-full blur-3xl"></div>
      </div>
      <p className="m-0 text-center text-6xl font-extrabold text-photo-green-200">
        {code}
      </p>
      <p className="m-0 text-center text-lg font-bold text-photo-green-700 md:text-2xl">
        {name}
      </p>
      <p className="m-0 text-center text-sm text-photo-green-500 md:text-lg">
        {message}
      </p>
      {dev && (
        <p className="m-0 text-center text-sm text-red-400 md:text-lg">
          Developer Notes: {dev}
        </p>
      )}
    </div>
  );
};

export default Error;
