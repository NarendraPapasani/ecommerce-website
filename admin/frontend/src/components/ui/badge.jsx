import React from "react";

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variants = {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    secondary: "bg-zinc-700 text-zinc-200 border border-zinc-600",
    destructive: "bg-red-900/30 text-red-300 border border-red-800",
    outline: "border border-zinc-700 text-zinc-300",
    success: "bg-green-900/30 text-green-300 border border-green-800",
    warning: "bg-amber-900/30 text-amber-300 border border-amber-800",
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
