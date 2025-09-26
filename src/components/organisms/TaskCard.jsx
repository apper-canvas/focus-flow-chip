import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isAfter, parseISO } from "date-fns";
import { toast } from "react-toastify";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    
    // Add a slight delay for animation effect
    setTimeout(() => {
      onToggleComplete(task.Id);
      setIsCompleting(false);
      
      if (!task.completed) {
        toast.success("Task completed! 🎉", {
          position: "top-right",
          autoClose: 2000
        });
      }
    }, 150);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.Id);
      toast.success("Task deleted successfully");
    }
  };

  const isOverdue = task.dueDate && !task.completed && isAfter(new Date(), parseISO(task.dueDate));

  const priorityConfig = {
    high: { variant: "high", icon: "AlertCircle", color: "text-error" },
    medium: { variant: "medium", icon: "Circle", color: "text-accent" },
    low: { variant: "low", icon: "Minus", color: "text-success" }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1
      }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -2, shadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 ${
        task.completed 
          ? "border-success/30 bg-gradient-to-r from-success/5 to-emerald-50" 
          : isOverdue 
            ? "border-error/30 bg-gradient-to-r from-error/5 to-red-50"
            : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <motion.div
            animate={{ scale: isCompleting ? 0.9 : 1 }}
            className="mt-1"
          >
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
            />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-2 transition-all duration-200 ${
              task.completed 
                ? "text-gray-500 line-through" 
                : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm leading-relaxed transition-all duration-200 ${
                task.completed 
                  ? "text-gray-400 line-through" 
                  : "text-gray-600"
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <Badge variant={priority.variant} className="shadow-sm">
            <ApperIcon name={priority.icon} size={12} className="mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-primary"
          >
            <ApperIcon name="Edit3" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-gray-500 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className={`flex items-center gap-2 ${
              isOverdue ? "text-error font-medium" : "text-gray-500"
            }`}>
              <ApperIcon 
                name={isOverdue ? "AlertTriangle" : "Calendar"} 
                size={14} 
              />
              <span>
                {isOverdue ? "Overdue: " : "Due: "}
                {format(parseISO(task.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-500">
            <ApperIcon name="Clock" size={14} />
            <span>
              Created {format(parseISO(task.createdAt), "MMM dd")}
            </span>
          </div>
        </div>

        {task.completed && task.completedAt && (
          <div className="flex items-center gap-2 text-success font-medium">
            <ApperIcon name="CheckCircle2" size={14} />
            <span>
              Completed {format(parseISO(task.completedAt), "MMM dd")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;