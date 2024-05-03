import { HTMLProps } from 'react';

export type InputProps = Omit<HTMLProps<HTMLInputElement>, 'placeholder'>;
