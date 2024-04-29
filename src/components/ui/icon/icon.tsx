import classNames from "classnames";
import React, { HTMLProps } from "react";
import IcoMoon from "react-icomoon";
import iconSet from "../../../assets/icons.json";
import { IconIdentifier } from "./constants";

export type IconProps = HTMLProps<SVGAElement> & {
  identifier: IconIdentifier;
};

export const Icon: React.FC<IconProps> = ({
  identifier,
  className,
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames("size-4", className);

  return (
    <IcoMoon
      iconSet={iconSet}
      icon={identifier}
      className={customClassNames}
      {...rest}
    />
  );
};
