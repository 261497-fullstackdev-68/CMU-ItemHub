import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const getVariantClasses = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-200 text-gray-800 hover:bg-gray-300";
    case "danger":
      return "bg-red-500 text-white hover:bg-red-600";
    case "primary":
    default:
      return "bg-indigo-600 text-white hover:bg-indigo-700";
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${getVariantClasses(
        variant
      )} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
