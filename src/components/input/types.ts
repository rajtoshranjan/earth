import { InputProps as HeadlessInputProps } from '@headlessui/react';
import { FieldError } from 'react-hook-form';

export type InputProps = Omit<HeadlessInputProps, 'placeholder'> & {
  label: string;
  error?: FieldError;
};
