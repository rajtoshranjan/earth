import { ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { IconIdentifier } from '../icon/constants';

export type ButtonProps = HeadlessButtonProps & {
  active?: boolean;
  iconIdentifier?: IconIdentifier;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};
