import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import { Icon, IconIdentifier } from '../icon';
import { ModalProps } from './type';

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  className,
  show,
  onClose,
  position = 'top-right',
  ...rest
}) => {
  // Constants.
  const customClassNames = classNames(
    'fixed below-header m-2 z-40 h-fit w-full max-w-sm transform overflow-hidden rounded-xl flex-col bg-gray-800 border pointer-events-auto border-gray-700 shadow-xl transition-all',
    className,
    {
      'left-1/2 !top-1/2 -translate-x-1/2 -translate-y-1/2':
        position === 'center',
      'left-1/2 -translate-x-1/2': position === 'top-center',
      'right-0': position === 'top-right',
    },
  );

  return (
    <Transition
      appear
      show={show}
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      unmount={true}
    >
      <div className={customClassNames} {...rest}>
        {/* Header */}
        <div className="flex h-12 items-center justify-between border-b border-gray-700 px-4">
          <h3 className="font-bold text-gray-50">{title}</h3>

          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-full border-none text-white outline-none hover:bg-gray-700"
            onClick={onClose}
          >
            <Icon identifier={IconIdentifier.Close} className="size-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 text-gray-50">{children}</div>
      </div>
    </Transition>
  );
};
