import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-slate-100 text-secondary",
    accent: "bg-accent/10 text-amber-700",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-amber-700",
    error: "bg-error/10 text-error",
    high: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    medium: "bg-gradient-to-r from-accent/10 to-amber-100 text-amber-700 border border-accent/20",
    low: "bg-gradient-to-r from-success/10 to-emerald-100 text-success border border-success/20",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;