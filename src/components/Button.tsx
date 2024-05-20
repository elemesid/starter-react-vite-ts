import React, { PropsWithChildren } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};
