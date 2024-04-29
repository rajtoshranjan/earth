import classNames from "classnames";
import React from "react";
import { Icon } from "../icon";
import { ButtonProps } from "./type";

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  iconIdentifier,
  active = false,
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-8 min-w-8 bg-gray-900 gap-2 hover:bg-gray-800 rounded",
    className,
    {
      "text-blue-400": active,
      "text-gray-50": !active,
    }
  );

  return (
    <button className={customClassNames} {...rest}>
      {iconIdentifier && (
        <Icon identifier={iconIdentifier} className="size-4" />
      )}

      {children}
    </button>
  );
};
