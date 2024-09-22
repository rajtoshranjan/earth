import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuItems,
  Transition,
} from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import { Icon } from '../icon';
import { DropdownMenuComponents, DropdownMenuProps } from './types';

export const DropdownMenu: React.FC<DropdownMenuProps> &
  DropdownMenuComponents = ({
  children,
  className,
  iconIdentifier,
  buttonBodyText,
  anchor = 'bottom end',
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames(
    'inline-flex items-center gap-2 rounded-md bg-gray-800 p-1.5 text-sm/6 font-semibold text-gray-50 focus:outline-none data-[hover]:bg-gray-700 data-[disabled]:cursor-not-allowed data-[disabled]:text-gray-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-gray-50',
    className,
  );

  return (
    <Menu>
      <MenuButton className={customClassNames} {...rest}>
        {iconIdentifier && <Icon identifier={iconIdentifier} />}
        {buttonBodyText}
      </MenuButton>

      <Transition
        enter="transition ease-out duration-75"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          anchor={anchor}
          className="z-50 mt-1 rounded-xl border border-gray-800/60 bg-gray-800/60 p-1 text-sm/6 text-gray-50 shadow-md backdrop-blur-md [--anchor-gap:var(--spacing-1)] focus:outline-none"
        >
          {children}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

const DropdownMenuItem: React.FC<MenuItemProps<'div'>> = ({
  children,
  className,
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames(
    'group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 cursor-pointer data-[focus]:bg-gray-50/10 data-[disabled]:text-gray-500 data-[disabled]:cursor-not-allowed',
    className,
  );

  return (
    <MenuItem as="div" className={customClassNames} {...rest}>
      {children}
    </MenuItem>
  );
};

DropdownMenu.Item = DropdownMenuItem;
