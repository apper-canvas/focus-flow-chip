import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete, filter }) => {
  if (!tasks || tasks.length === 0) {
    const emptyStates = {
      all: {
        title: "No tasks yet",
        message: "Start by adding your first task to get organized!",
        icon: "CheckSquare"
      },
      active: {
        title: "No active tasks",
        message: "Great job! You've completed all your tasks or haven't added any yet.",
        icon: "Clock"
      },
      completed: {
        title: "No completed tasks",
        message: "Complete some tasks to see them here!",
        icon: "CheckCircle2"
      },
      high: {
        title: "No high priority tasks",
        message: "You don't have any urgent tasks at the moment.",
        icon: "AlertCircle"
      },
      medium: {
        title: "No medium priority tasks",
        message: "No medium priority tasks found.",
        icon: "Circle"
      },
      low: {
        title: "No low priority tasks",
        message: "No low priority tasks found.",
        icon: "Minus"
      }
    };

    const emptyState = emptyStates[filter] || emptyStates.all;
    return <Empty {...emptyState} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Tasks ({tasks.length})
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;