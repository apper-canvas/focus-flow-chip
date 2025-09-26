import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [formData, setFormData] = useState({
title: editingTask?.title || editingTask?.title_c || "",
    description: editingTask?.description || editingTask?.description_c || "",
    dueDate: editingTask?.dueDate || editingTask?.due_date_c || "",
    priority: editingTask?.priority || editingTask?.priority_c || "medium"
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const taskData = {
title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || null
    };

    onSubmit(taskData);
    
    // Reset form if not editing
    if (!editingTask) {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium"
      });
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
          <ApperIcon name={editingTask ? "Edit3" : "Plus"} size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
            className="font-medium"
          />
          
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Add task details..."
          rows={4}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              options={priorityOptions}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <ApperIcon name={editingTask ? "Save" : "Plus"} size={16} className="mr-2" />
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
          
          {editingTask && onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;