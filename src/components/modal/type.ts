import { HTMLProps } from 'react';

export type ModalBaseProps = HTMLProps<HTMLDivElement>;

export type ModalProps = ModalBaseProps & {
  title: string;
  position?: 'center' | 'top-center' | 'top-right';
  show: boolean;
  onClose: VoidFunction;
};
