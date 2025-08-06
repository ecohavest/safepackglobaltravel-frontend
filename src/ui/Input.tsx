import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
}

const Input = ({ name, ...rest }: InputProps) => (
  <input name={name} {...rest} />
);

export default Input;
