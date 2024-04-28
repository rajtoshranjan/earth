import { useToggle } from "@uidotdev/usehooks";
import React from "react";
import { ReactSVG } from "react-svg";
import { Icon } from "../../../assets/icons";
import { ModalBaseProps, ModalComponents, ModalProps } from "./type";
import classNames from "classnames";

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
    show && (
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className={customClassNames} {...rest}>
          <div className="flex flex-col bg-neutral-800 border shadow-sm rounded-xl pointer-events-auto border-neutral-700 shadow-neutral-700/70">
            {/* Header */}
            <div className="flex justify-between items-center py-3 px-4 border-b border-neutral-700">
              <h3 className="font-bold  text-gray-50">{title}</h3>

              <button
                type="button"
                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent  disabled:opacity-50 disabled:pointer-events-none text-white hover:bg-neutral-700"
                onClick={() => toggle()}
              >
                <ReactSVG src={Icon.Close} className="size-6" />
              </button>
            </div>

            {children}
          </div>
        </div>
      </div>
    )
  );
};

Modal.Body = React.forwardRef<HTMLElement, ModalBaseProps>(
  ({ children, className, ...rest }) => {
    // Constants.
    const customClassNames = classNames(
      "p-4 overflow-y-auto text-gray-50",
      className
    );

    return (
      <div className={customClassNames} {...rest}>
        {children}
      </div>
    );
  }
);

Modal.Footer = React.forwardRef<HTMLElement, ModalBaseProps>(
  ({ children, className, ...rest }) => {
    // Constants.
    const customClassNames = classNames(
      "flex justify-end items-center gap-x-2 py-3 px-4 border-t border-neutral-700",
      className
    );

    return <div className={customClassNames}>{children}</div>;
  }
);
