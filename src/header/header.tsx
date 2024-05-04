import { Icon, IconIdentifier } from '../components';
import { Auth } from './auth';
import { Search } from './search';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[3.4rem] w-full items-center justify-between border-b border-gray-700 bg-gray-900 px-4">
      {/* Left Side */}
      <div className="flex space-x-4">
        <div className="flex select-none items-center space-x-2">
          <Icon
            identifier={IconIdentifier.Earth}
            className="size-6 text-blue-500"
          />
          <span className="text-lg font-bold text-gray-50">Earth</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-8/12 items-center space-x-4 md:w-6/12 lg:w-3/12">
        <Search />
        <Auth />
      </div>
    </header>
  );
};
