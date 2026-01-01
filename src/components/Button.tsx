import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg'; // Add this line
}

function Button({ children, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const className = `btn btn-${variant} btn-${size}`;

  return (
    <button
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;