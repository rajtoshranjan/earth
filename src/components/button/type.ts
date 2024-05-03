import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { IconIdentifier } from '../icon/constants';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  active?: boolean;
  iconIdentifier?: IconIdentifier;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};
