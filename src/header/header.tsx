import { Icon, IconIdentifier } from "../components";
import { Auth } from "./auth";
import { Search } from "./search";

export const Header = () => {
  return (
    <header className="sticky z-50 top-0 w-full h-[3.4rem] bg-gray-900 border-b border-gray-700 px-4 flex items-center justify-between">
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
        <Auth />
      </div>
    </header>
  );
};
