import { useState } from 'react';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { AuthPanel } from '../auth-panel';

import { Search } from './search';

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      <div className="flex w-8/12 items-center justify-end gap-3 md:w-6/12 lg:w-4/12">
        <DropdownMenu
          iconIdentifier={IconIdentifier.Settings}
          className="flex size-8 items-center justify-center rounded-lg border border-transparent bg-transparent text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-gray-50 focus:border-gray-700 focus:bg-gray-800 focus:text-gray-50 data-[open]:border-gray-700 data-[open]:bg-gray-800 data-[open]:text-gray-50"
          anchor="bottom end"
        >
          <DropdownMenu.Item onClick={() => setShowAuthModal(true)}>
            <Icon identifier={IconIdentifier.Shield} className="size-4" />
            Auth Methods
          </DropdownMenu.Item>
        </DropdownMenu>

        {/* A vertical divider */}
        <div className="h-6 w-px bg-gray-700" />
        <Search />
      </div>

      <AuthPanel show={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};
