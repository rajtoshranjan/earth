import { Field, Input as HeadlessInput, Label } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import { InputProps } from './types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, ...rest }, ref) => {
    // Constants.
    const containerClassName = classNames(className);
    const fieldClassName = classNames(
      'relative z-0 rounded-lg border bg-gray-800 overflow-hidden',
      {
        'border-red-400': !!error,
      },
    );

    // Helpers.
    const getErrorMessage = () => {
      if (error?.type === 'required') {
        return 'This field is required';
      }

      return error?.message;
    };

    return (
      <div className={containerClassName}>
        <Field className={fieldClassName}>
          <HeadlessInput
            className="peer w-full bg-transparent px-2 py-1 text-gray-300 outline-none placeholder:text-transparent"
            placeholder=""
            {...rest}
            ref={ref}
          />
          <Label className="-z-1 absolute left-0 ml-1 -translate-y-3 bg-gray-800 px-1 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-[0.36rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-3 peer-focus:text-xs">
            {label}
          </Label>
        </Field>
        {error && (
          <p className="ml-1 mt-1 text-xs text-red-400">{getErrorMessage()}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
