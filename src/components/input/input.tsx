import React from "react";
import { InputProps } from "./types";
import classNames from "classnames";

export const Input: React.FC<InputProps> = ({ label, className, ...rest }) => {
  // Constants.
  const customClassNames = classNames(
    "relative z-0 bg-gray-800 border rounded-lg",
    className
  );

  return (
    <div className={customClassNames}>
      <input
        type="email"
        className="peer bg-transparent w-full py-1 px-2 placeholder:text-transparent text-gray-300 outline-none"
        placeholder="name"
        {...rest}
      />
      <label className="-z-1 absolute left-0 px-1 ml-1 -translate-y-3 bg-gray-800 text-xs duration-100 ease-linear peer-placeholder-shown:translate-y-[0.36rem] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-3 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );
};
