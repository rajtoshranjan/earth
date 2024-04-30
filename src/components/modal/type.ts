import { HTMLProps } from "react";
import { ForwardRef } from "../../utils";

export type ModalBaseProps = HTMLProps<HTMLDivElement>;

export type ModalProps = ModalBaseProps & {
  title: string;
  size?: "sm" | "md" | "lg";
};

export type ModalComponents = {
  Body: ForwardRef<HTMLDivElement, ModalBaseProps>;
  Footer: ForwardRef<HTMLDivElement, ModalBaseProps>;
};
