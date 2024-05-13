import { InputProps as HeadlessInputProps } from '@headlessui/react';

export type InputProps = Omit<HeadlessInputProps, 'placeholder'> & {
  label: string;
};
