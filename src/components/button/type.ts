import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";
import { IconIdentifier } from "../icon/constants";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  active?: boolean;
  iconIdentifier?: IconIdentifier;
};
