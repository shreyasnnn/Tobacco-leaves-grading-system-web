import React from "react";
import classNames from "classnames";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "empty";
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-black text-white",
    secondary: "bg-green-700 text-white border",
    empty: "bg-transparent text-inherit",
  };

  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 px-6 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
