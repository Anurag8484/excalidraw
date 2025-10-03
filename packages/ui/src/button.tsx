"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  onClick?:(event: React.MouseEvent<HTMLButtonElement>)=>void
}

export const Button = ({ children, className, appName, onClick }: ButtonProps) => {
  return (
    <button
      className={
        className
      }
      onClick={
        onClick}
    >
      {children}
    </button>
  );
};
