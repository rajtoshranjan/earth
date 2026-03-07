import { Field, Label } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import { Icon, IconIdentifier } from '../icon';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, error, children, ...rest }, ref) => {
    // Constants.
    const containerClassName = classNames(className);
    const fieldClassName = classNames(
      'relative z-0 rounded-lg border bg-gray-800',
      {
        'border-red-400': !!error,
        'border-gray-700': !error,
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
          <select
            className="peer w-full cursor-pointer appearance-none rounded-lg bg-transparent px-2 py-1.5 text-sm text-gray-300 outline-none"
            {...rest}
            ref={ref}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon
              identifier={IconIdentifier.Down}
              className="size-3 text-gray-400"
            />
          </div>
          <Label className="-z-1 absolute left-0 ml-1 -translate-y-3 bg-gray-800 px-1 text-xs text-gray-400 duration-100 ease-linear peer-focus:text-blue-400">
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

Select.displayName = 'Select';
