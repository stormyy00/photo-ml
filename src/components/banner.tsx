const Banner = () => {
  return (
    <div className="w-full bg-white py-8 lg:py-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 lg:gap-0">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-photo-green-300 leading-[1.1]">
            Built for
            <br />
            <span className="bg-gradient-to-r from-photo-green-300 to-photo-green-200 bg-clip-text text-transparent">
              photographers,
            </span>
          </h2>

          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-photo-green-300 leading-[1.1] ml-0">
            <span className="bg-gradient-to-r from-photo-green-200 to-photo-green-300 bg-clip-text text-transparent">
              creators,
            </span>
          </h2>

          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-photo-green-300 leading-[1.1]">
            <span className="bg-gradient-to-r from-photo-green-300 to-photo-green-200 bg-clip-text text-transparent">
              casuals
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Banner;
