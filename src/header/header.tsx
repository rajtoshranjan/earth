import { DropdownMenu, Icon, IconIdentifier } from '../components';

import { Search } from './search';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[3.4rem] w-full items-center justify-between border-b border-gray-700 bg-gray-900 px-4">
      {/* Left Side */}
      <DropdownMenu
        buttonBody={
          <div className="group flex select-none items-center space-x-2">
            <div className="flex w-6 items-center justify-center">
              <Icon
                identifier={IconIdentifier.Earth}
                className="size-6 text-blue-500 transition-all duration-150 group-hover:rotate-180 group-hover:opacity-0"
              />
              <Icon
                identifier={IconIdentifier.Down}
                className="absolute size-4 opacity-0 transition-all duration-150 group-hover:rotate-0 group-hover:opacity-100"
              />
            </div>
            <span className="text-lg font-bold text-gray-50">Earth</span>
          </div>
        }
        className="-ml-2 bg-transparent"
        anchor="bottom start"
      >
        <DropdownMenu.Item>
          <a
            href="https://github.com/rajtoshranjan/earth"
            target="_blank"
            rel="noreferrer"
            title="View on GitHub"
            className="flex items-center gap-2"
          >
            <Icon identifier={IconIdentifier.GitHub} /> Source Code
          </a>
        </DropdownMenu.Item>
      </DropdownMenu>

      {/* Right Side */}
      <div className="flex w-8/12 items-center justify-end gap-3 md:w-6/12 lg:w-3/12">
        {/* A vertical divider */}
        <div className="h-6 w-px bg-gray-700" />
        <Search />
      </div>
    </header>
  );
};
