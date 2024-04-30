import { useToggle } from "@uidotdev/usehooks";
import React from "react";

import classNames from "classnames";
import { Icon, IconIdentifier } from "../icon";
import { ModalComponents, ModalProps } from "./type";

export const Modal: React.FC<ModalProps> & ModalComponents = ({
  title,
  children,
  className,
  size = "sm",
  ...rest
}) => {
  // States.
  const [show, toggle] = useToggle(true);

  // Constants.
  const customClassNames = classNames(
    "relative my-6 mx-auto max-w-3xl",
    className,
    {
      "w-3/12": size === "sm",
      "w-6/12": size === "md",
      "w-8/12": size === "lg",
    }
  );

  return (
    <>
      {show && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className={customClassNames} {...rest}>
            <div className="flex flex-col bg-gray-800 border shadow-sm rounded-xl pointer-events-auto border-gray-700 shadow-gray-700/70">
              {/* Header */}
              <div className="flex justify-between items-center py-3 px-4 border-b border-gray-700">
                <h3 className="font-bold  text-gray-50">{title}</h3>

                <button
                  type="button"
                  className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent  disabled:opacity-50 disabled:pointer-events-none text-white hover:bg-gray-700"
                  onClick={() => toggle()}
                >
                  <Icon identifier={IconIdentifier.Close} className="size-6" />
                </button>
              </div>

              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Modal.Body = React.forwardRef(({ children, className, ...rest }, ref) => {
  // Constants.
  const customClassNames = classNames(
    "p-4 overflow-y-auto text-gray-50",
    className
  );

  return (
    <div ref={ref} className={customClassNames} {...rest}>
      {children}
    </div>
  );
});

Modal.Footer = React.forwardRef(({ children, className, ...rest }, ref) => {
  // Constants.
  const customClassNames = classNames(
    "flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-700",
    className
  );

  return (
    <div ref={ref} className={customClassNames}>
      {children}
    </div>
  );
});
