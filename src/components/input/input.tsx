import React from 'react';
import classNames from 'classnames';
import { Field, Label, Input as HeadlessInput } from '@headlessui/react';
import { InputProps } from './types';

export const Input: React.FC<InputProps> = ({ label, className, ...rest }) => {
  // Constants.
  const customClassNames = classNames(
    'relative z-0 bg-gray-800 border rounded-lg',
    className,
  );

  return (
    <Field className={customClassNames}>
      <HeadlessInput
        type="email"
        className="peer w-full bg-transparent px-2 py-1 text-gray-300 outline-none placeholder:text-transparent"
        placeholder=""
        {...rest}
      />
      <Label className="-z-1 absolute left-0 ml-1 -translate-y-3 bg-gray-800 px-1 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-[0.36rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-3 peer-focus:text-xs">
        {label}
      </Label>
    </Field>
  );
};
