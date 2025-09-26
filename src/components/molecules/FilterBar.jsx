import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ activeFilter, onFilterChange, taskCounts = {} }) => {
  const filters = [
    { 
      key: "all", 
      label: "All Tasks", 
      icon: "List", 
      count: taskCounts.all || 0
    },
    { 
      key: "active", 
      label: "Active", 
      icon: "Clock", 
      count: taskCounts.active || 0
    },
    { 
      key: "completed", 
      label: "Completed", 
      icon: "CheckCircle2", 
      count: taskCounts.completed || 0
    }
  ];

  const priorityFilters = [
    { 
      key: "high", 
      label: "High", 
      icon: "AlertCircle", 
      count: taskCounts.high || 0,
      color: "text-error"
    },
    { 
      key: "medium", 
      label: "Medium", 
      icon: "Circle", 
      count: taskCounts.medium || 0,
      color: "text-accent"
    },
    { 
      key: "low", 
      label: "Low", 
      icon: "Minus", 
      count: taskCounts.low || 0,
      color: "text-success"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Status Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Filter" size={16} />
          Filter by Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <motion.div
              key={filter.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={activeFilter === filter.key ? "primary" : "secondary"}
                size="sm"
                onClick={() => onFilterChange(filter.key)}
                className={`${
                  activeFilter === filter.key 
                    ? "shadow-lg transform scale-[1.02]" 
                    : "hover:shadow-md"
                } transition-all duration-200`}
              >
                <ApperIcon name={filter.icon} size={14} className="mr-2" />
                {filter.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {filter.count}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Flag" size={16} />
          Filter by Priority
        </h3>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter, index) => (
            <motion.div
              key={filter.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.15 }}
            >
              <Button
                variant={activeFilter === filter.key ? "primary" : "secondary"}
                size="sm"
                onClick={() => onFilterChange(filter.key)}
                className={`${
                  activeFilter === filter.key 
                    ? "shadow-lg transform scale-[1.02]" 
                    : "hover:shadow-md"
                } transition-all duration-200`}
              >
                <ApperIcon 
                  name={filter.icon} 
                  size={14} 
                  className={`mr-2 ${activeFilter === filter.key ? "text-white" : filter.color}`} 
                />
                {filter.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {filter.count}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;