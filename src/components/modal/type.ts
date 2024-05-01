import { HTMLProps } from "react";
import { ForwardRef } from "../../utils";

export type ModalBaseProps = HTMLProps<HTMLDivElement>;

export type ModalProps = ModalBaseProps & {
  title: string;
  position?: "center" | "top-center" | "top-right";
  show: boolean;
  onClose: VoidFunction;
};
