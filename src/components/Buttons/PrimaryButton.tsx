import React from 'react';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-primary d-flex justify-content-center align-items-center gap-2 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
