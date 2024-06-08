import classNames from 'classnames';
import React from 'react';

type SpinnerProps = React.HTMLProps<HTMLDivElement>;

export const Spinner: React.FC<SpinnerProps> = ({ className, ...rest }) => {
  // Constants.
  const customClassNames = classNames(
    'size-8 animate-spin rounded-full border-4 border-gray-600 border-t-gray-400',
    className,
  );

  return <div className={customClassNames} {...rest} />;
};
