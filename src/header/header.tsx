import { Icon, IconIdentifier } from "../components";
import { Search } from "./search";

export const Header = () => {
  return (
    <header className="sticky z-10 top-0 w-full bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2 select-none">
          <Icon
            identifier={IconIdentifier.Earth}
            className="h-6 w-6 text-blue-500"
          />
          <span className="text-lg font-bold text-gray-50">Earth</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-8/12 md:w-6/12 lg:w-3/12 items-center space-x-4">
        <Search />

        <button className="w-8 h-8 border flex shrink-0 overflow-hidden rounded-full ">
          <img
            className="aspect-square h-full w-full"
            src="https://source.unsplash.com/random/100x100?sig=1"
          />
        </button>
      </div>
    </header>
  );
};
