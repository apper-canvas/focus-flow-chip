import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import TaskService from "@/services/api/TaskService";
import ApperIcon from "@/components/ApperIcon";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import TaskForm from "@/components/molecules/TaskForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import TaskStats from "@/components/organisms/TaskStats";
import TaskList from "@/components/organisms/TaskList";
import Button from "@/components/atoms/Button";
const TaskManager = () => {
const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  
  // Authentication context and user state
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  // Load tasks on component mount
useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const tasksData = await TaskService.getAll();
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      // Map form data to database fields
      const mappedData = {
        title: taskData.title,
        title_c: taskData.title,
        description: taskData.description,
        description_c: taskData.description,
        completed: false,
        completed_c: false,
        priority: taskData.priority,
        priority_c: taskData.priority,
        dueDate: taskData.dueDate,
        due_date_c: taskData.dueDate,
        completedAt: null,
        completed_at_c: null
      };
      
      const newTask = await TaskService.create(mappedData);
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    try {
      // Map form data to database fields
      const mappedData = {
        title: taskData.title,
        title_c: taskData.title,
        description: taskData.description,
        description_c: taskData.description,
        completed: taskData.completed !== undefined ? taskData.completed : editingTask.completed,
        completed_c: taskData.completed !== undefined ? taskData.completed : editingTask.completed_c,
        priority: taskData.priority,
        priority_c: taskData.priority,
        dueDate: taskData.dueDate,
        due_date_c: taskData.dueDate,
        completedAt: taskData.completedAt || editingTask.completedAt,
        completed_at_c: taskData.completedAt || editingTask.completed_at_c
      };
      
      const updatedTask = await TaskService.update(editingTask.Id, mappedData);
      setTasks(prev => 
        prev.map(task => 
          task.Id === editingTask.Id ? updatedTask : task
        )
      );
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedData = {
        completed: !task.completed,
        completed_c: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
        completed_at_c: !task.completed ? new Date().toISOString() : null
      };

      const updatedTask = await TaskService.update(taskId, updatedData);

      setTasks(prev => 
        prev.map(t => 
          t.Id === taskId ? updatedTask : t
        )
      );
      
      toast.success(!task.completed ? "Task completed!" : "Task marked as incomplete");
    } catch (err) {
      toast.error("Failed to update task status");
      console.error("Error toggling task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const success = await TaskService.delete(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };


  // Filter and search tasks
const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter - check both title and title_c for compatibility
    if (searchTerm.trim()) {
      filtered = filtered.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.title_c && task.title_c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description_c && task.description_c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status/priority filter - check both old and new field names for compatibility
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter(task => !(task.completed || task.completed_c));
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed || task.completed_c);
        break;
      case "high":
        filtered = filtered.filter(task => 
          (task.priority && task.priority === "high") || 
          (task.priority_c && task.priority_c === "high")
        );
        break;
      case "medium":
        filtered = filtered.filter(task => 
          (task.priority && task.priority === "medium") || 
          (task.priority_c && task.priority_c === "medium")
        );
        break;
      case "low":
        filtered = filtered.filter(task => 
          (task.priority && task.priority === "low") || 
          (task.priority_c && task.priority_c === "low")
        );
        break;
      case "all":
      default:
        // No additional filtering
        break;
    }

    // Sort tasks: incomplete first, then by priority, then by due date
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom - check both field names
      const aCompleted = a.completed || a.completed_c || false;
      const bCompleted = b.completed || b.completed_c || false;
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }

      // Sort by priority - check both field names
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = a.priority || a.priority_c || 'medium';
      const bPriority = b.priority || b.priority_c || 'medium';
      const priorityDiff = priorityOrder[bPriority] - priorityOrder[aPriority];
      if (priorityDiff !== 0) return priorityDiff;

      // Sort by due date (earliest first) - check both field names
      const aDueDate = a.dueDate || a.due_date_c;
      const bDueDate = b.dueDate || b.due_date_c;
      
      if (aDueDate && bDueDate) {
        return new Date(aDueDate) - new Date(bDueDate);
      }
      if (aDueDate) return -1;
      if (bDueDate) return 1;

      // Sort by creation date (newest first)
      const aCreated = a.createdAt || a.CreatedOn || new Date();
      const bCreated = b.createdAt || b.CreatedOn || new Date();
      return new Date(bCreated) - new Date(aCreated);
    });
  }, [tasks, searchTerm, activeFilter]);

  // Calculate task counts for filters
const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter(task => !(task.completed || task.completed_c)).length,
      completed: tasks.filter(task => task.completed || task.completed_c).length,
      high: tasks.filter(task => 
        (task.priority && task.priority === "high") || 
        (task.priority_c && task.priority_c === "high")
      ).length,
      medium: tasks.filter(task => 
        (task.priority && task.priority === "medium") || 
        (task.priority_c && task.priority_c === "medium")
      ).length,
      low: tasks.filter(task => 
        (task.priority && task.priority === "low") || 
        (task.priority_c && task.priority_c === "low")
      ).length
    };
  }, [tasks]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-blue-50">
      {/* Header with user info and logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Focus Flow</h1>
                <p className="text-sm text-gray-500">Task Management System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.emailAddress}</p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <TaskStats tasks={tasks} />
        </div>

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={handleSearchClear}
          />
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={taskCounts}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          filter={activeFilter}
        />
      </div>
    </div>
);
};

export default TaskManager;