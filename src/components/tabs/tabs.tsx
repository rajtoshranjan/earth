import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
  TabListProps,
  TabProps,
} from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

export const TabGroup = HeadlessTabGroup;
export const TabPanels = HeadlessTabPanels;
export const TabPanel = HeadlessTabPanel;

export const TabList: React.FC<TabListProps> = ({ className, ...rest }) => {
  return (
    <HeadlessTabList
      className={classNames(
        'flex space-x-1 rounded-xl border border-gray-700/50 bg-gray-900/50 p-1',
        className,
      )}
      {...rest}
    />
  );
};

export const Tab: React.FC<TabProps> = ({ className, ...rest }) => {
  return (
    <HeadlessTab
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className={(bag: any) =>
        classNames(
          'w-full cursor-pointer rounded-lg py-2 text-sm font-medium leading-5 transition-all duration-200',
          'outline-none focus:outline-none focus:ring-2 focus:ring-gray-500/50',
          bag.selected
            ? 'bg-gray-700 text-white shadow-sm'
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200',
          typeof className === 'function' ? className(bag) : className,
        )
      }
      {...rest}
    />
  );
};
