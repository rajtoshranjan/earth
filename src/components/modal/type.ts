import { HTMLProps, ReactNode } from 'react';

export type ModalBaseProps = HTMLProps<HTMLDivElement>;

export type ModalProps = Omit<ModalBaseProps, 'title'> & {
  title: ReactNode;
  position?: 'center' | 'top-center' | 'top-right' | 'bottom-left';
  show: boolean;
  onClose: VoidFunction;
};
