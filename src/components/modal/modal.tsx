import { Dialog, Transition } from "@headlessui/react";
import { useToggle } from "@uidotdev/usehooks";
import classNames from "classnames";
import React, { Fragment } from "react";
import { Icon, IconIdentifier } from "../icon";
import { ModalProps } from "./type";

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  className,
  position = "top-right",
  ...rest
}) => {
  // States.
  const [show, toggle] = useToggle(true);

  // Constants.
  const customClassNames = classNames("flex p-2", className, {
    "items-center justify-center h-full": position === "center",
    "justify-center": position === "top-center",
    "justify-end": position === "top-right",
  });

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="fixed inset-0 z-40 below-header h-fit">
        <div className={customClassNames} {...rest}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="w-full max-w-sm transform overflow-hidden rounded-xl flex-col bg-gray-800 border pointer-events-auto border-gray-700 shadow-xl transition-all">
              {/* Header */}
              <div className="flex justify-between items-center h-12 px-4 border-b border-gray-700">
                <h3 className="font-bold text-gray-50">{title}</h3>

                <button
                  type="button"
                  className="flex justify-center items-center size-7 rounded-full border-none outline-none text-white hover:bg-gray-700"
                  onClick={() => toggle()}
                >
                  <Icon identifier={IconIdentifier.Close} className="size-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto text-gray-50">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};
