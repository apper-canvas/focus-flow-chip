import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const TaskStats = ({ tasks = [] }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date() > new Date(task.dueDate);
    }).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: "List",
      color: "from-primary to-blue-600",
      textColor: "text-primary"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "CheckCircle2",
      color: "from-success to-emerald-600",
      textColor: "text-success"
    },
    {
      title: "Active",
      value: stats.active,
      icon: "Clock",
      color: "from-accent to-amber-600",
      textColor: "text-accent"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: "AlertTriangle",
      color: "from-error to-red-600",
      textColor: "text-error"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2, scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
              <ApperIcon name={stat.icon} size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
              {stat.title === "Completed" && stats.total > 0 && (
                <div className="text-xs text-gray-500 font-medium">
                  {completionRate}% done
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-sm font-semibold text-gray-700">{stat.title}</h3>
          
          {/* Progress bar for completion rate */}
          {stat.title === "Completed" && stats.total > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-success to-emerald-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TaskStats;