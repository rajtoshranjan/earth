import { MenuItemProps, MenuButtonProps } from '@headlessui/react';
import { AnchorProps } from '@headlessui/react/dist/internal/floating';
import React, { ReactNode } from 'react';
import { IconIdentifier } from '../icon';

export type DropdownMenuComponents = {
  Item: React.FC<MenuItemProps<'div'>>;
};

export type DropdownMenuProps = MenuButtonProps & {
  children: ReactNode;
  anchor?: AnchorProps;
  iconIdentifier?: IconIdentifier;
  buttonBodyText?: string;
};
