import { Button, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { Fragment, useRef, useState, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial position based on the position prop when modal first shows
    if (
      show &&
      currentPosition.x === null &&
      currentPosition.y === null &&
      modalRef.current
    ) {
      const rect = modalRef.current.getBoundingClientRect();
      setCurrentPosition({ x: rect.left, y: rect.top });
    }
  }, [show]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setCurrentPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Check if the click/touch target is an interactive element
    const targetElement = e.target as HTMLElement;
    const isButton = targetElement.closest('button');
    const isInput = targetElement.closest('input');

    if (isButton || isInput) {
      return;
    }

    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Constants.
  const customClassNames = classNames(
    'fixed m-2 z-40 h-fit w-full max-w-sm transform overflow-hidden rounded-xl flex-col bg-gray-800 border pointer-events-auto border-gray-700 shadow-xl',
    className,
  );

  const getInitialPosition = () => {
    if (currentPosition.x !== null && currentPosition.y !== null) {
      return '';
    }

    switch (position) {
      case 'center':
        return 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-center':
        return 'left-1/2 -translate-x-1/2 below-header';
      case 'top-right':
        return 'right-0 below-header';
      case 'bottom-left':
        return 'left-0 bottom-0';
      default:
        return '';
    }
  };

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
      <div
        ref={modalRef}
        className={`${customClassNames} ${getInitialPosition()}`}
        style={{
          left:
            currentPosition.x !== null ? `${currentPosition.x}px` : undefined,
          top:
            currentPosition.y !== null ? `${currentPosition.y}px` : undefined,
          transform: currentPosition.x !== null ? 'none' : undefined,
          touchAction: 'none',
        }}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        {/* Header */}
        <div
          className="flex h-12 w-full items-center justify-between border-b border-gray-700 px-4"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsDragging(true);
            }
          }}
        >
          <h3 className="select-none font-bold text-gray-50">{title}</h3>

          <Button
            type="button"
            className="flex size-7 items-center justify-center rounded-full border-none text-white outline-none hover:bg-gray-700"
            onClick={onClose}
          >
            <Icon identifier={IconIdentifier.Close} className="size-6" />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 text-gray-50">{children}</div>
      </div>
    </Transition>
  );
};
