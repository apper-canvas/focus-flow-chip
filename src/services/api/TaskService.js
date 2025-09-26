import taskData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...taskData];
    this.loadFromStorage();
  }

  // Load tasks from localStorage if available
  loadFromStorage() {
    try {
      const saved = localStorage.getItem("focus-flow-tasks");
      if (saved) {
        this.tasks = JSON.parse(saved);
      }
    } catch (error) {
      console.warn("Failed to load tasks from storage:", error);
    }
  }

  // Save tasks to localStorage
  saveToStorage() {
    try {
      localStorage.setItem("focus-flow-tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.warn("Failed to save tasks to storage:", error);
    }
  }

  // Simulate async operation
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  // Get all tasks
  async getAll() {
    await this.delay();
    return [...this.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get task by ID
  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return { ...task };
  }

  // Create new task
  async create(taskData) {
    await this.delay();
    
    // Find highest existing ID and add 1
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      completed: false,
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.tasks.push(newTask);
    this.saveToStorage();
    return { ...newTask };
  }

  // Update existing task
  async update(id, updateData) {
    await this.delay();
    
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }

    const updatedTask = {
      ...this.tasks[index],
      ...updateData,
      Id: id // Ensure ID doesn't change
    };

    this.tasks[index] = updatedTask;
    this.saveToStorage();
    return { ...updatedTask };
  }

  // Delete task
  async delete(id) {
    await this.delay();
    
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }

    this.tasks.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Get tasks by status
  async getByStatus(completed) {
    await this.delay();
    return this.tasks.filter(task => task.completed === completed);
  }

  // Get tasks by priority
  async getByPriority(priority) {
    await this.delay();
    return this.tasks.filter(task => task.priority === priority);
  }

  // Search tasks
  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    );
  }
}

export default new TaskService();