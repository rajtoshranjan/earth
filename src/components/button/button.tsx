import classNames from "classnames";
import React from "react";
import { Icon } from "../icon";
import { ButtonProps } from "./type";

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  iconIdentifier,
  active = false,
  variant = "primary",
  size = "sm",
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium p-2 gap-2 rounded-lg",
    className,
    {
      "bg-gray-900 hover:bg-gray-800": variant == "primary",
      "bg-transparent hover:bg-gray-700": variant == "secondary",
      "text-blue-400": active,
      "text-gray-50": !active,
      "h-10 min-w-10": size === "md",
      "h-12 min-w-12": size === "lg",
    }
  );

  return (
    <button className={customClassNames} {...rest}>
      {iconIdentifier && <Icon identifier={iconIdentifier} />}

      {children}
    </button>
  );
};
