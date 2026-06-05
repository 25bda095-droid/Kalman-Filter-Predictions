// src/components/Button.jsx
import { forwardRef } from 'react';

const Button = forwardRef(function Button(
  {
    variant = 'primary',  // primary | secondary | ghost | danger
    size    = 'md',       // sm | md | lg
    full    = false,
    ping    = false,
    children,
    className = '',
    ...rest
  },
  ref
) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    full ? 'btn-full' : '',
    ping ? 'btn-primary-ping' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  );
});

export default Button;
