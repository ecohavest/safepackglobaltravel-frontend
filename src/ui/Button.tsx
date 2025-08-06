import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...rest }: ButtonProps) => (
  <button className={` ${className}`} {...rest}>
    {children}
  </button>
);
