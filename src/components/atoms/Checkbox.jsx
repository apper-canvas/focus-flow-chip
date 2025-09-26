import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  checked = false, 
  onChange, 
  label, 
  className, 
  ...props 
}, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
          "group-hover:border-primary/60",
          checked 
            ? "bg-gradient-to-r from-primary to-blue-600 border-primary" 
            : "bg-white border-slate-300 hover:border-slate-400",
          className
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white animate-scale-in" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;