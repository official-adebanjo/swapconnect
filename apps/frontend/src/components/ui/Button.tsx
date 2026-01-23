import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "success"
    | "destructive"
    | "outline-secondary"
    | "outline-success"
    | "link";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses =
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      break;
    case "success":
      variantClasses =
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500";
      break;
    case "destructive":
      variantClasses =
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    case "outline-secondary":
      variantClasses =
        "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400";
      break;
    case "outline-success":
      variantClasses =
        "border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500";
      break;
    case "link":
      variantClasses = "text-blue-600 hover:underline";
      break;
    default:
      variantClasses =
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  }

  return (
    <button
      className={`${baseClasses} ${className || variantClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
