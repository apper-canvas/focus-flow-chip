import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet", 
  message = "Start by adding your first task to get organized!",
  icon = "CheckSquare"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={36} className="text-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-secondary text-lg max-w-md leading-relaxed">{message}</p>
      <div className="mt-8 flex items-center gap-2 text-accent">
        <ApperIcon name="ArrowUp" size={16} />
        <span className="text-sm font-medium">Use the form above to create your first task</span>
      </div>
    </motion.div>
  );
};

export default Empty;