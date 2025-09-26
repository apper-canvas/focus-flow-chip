class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.apperClient = null;
    this.initializeClient();
  }

  // Initialize ApperClient
  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Ensure client is initialized
  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    return this.apperClient;
  }

  // Map application fields to database fields for create/update
  mapToDbFields(taskData) {
    return {
      // Include only updateable fields based on task_c schema
      Name: taskData.title || taskData.title_c || '',
      title_c: taskData.title || taskData.title_c || '',
      description_c: taskData.description || taskData.description_c || '',
      completed_c: taskData.completed !== undefined ? taskData.completed : taskData.completed_c,
      priority_c: taskData.priority || taskData.priority_c || 'medium',
      due_date_c: taskData.dueDate || taskData.due_date_c || null,
      completed_at_c: taskData.completedAt || taskData.completed_at_c || null
    };
  }

  // Map database response to application format
  mapFromDbFields(dbTask) {
    return {
      Id: dbTask.Id,
      title: dbTask.title_c || dbTask.Name || '',
      description: dbTask.description_c || '',
      completed: dbTask.completed_c || false,
      priority: dbTask.priority_c || 'medium',
      dueDate: dbTask.due_date_c || null,
      completedAt: dbTask.completed_at_c || null,
      createdAt: dbTask.CreatedOn || new Date().toISOString(),
      // Keep original database fields for reference
      title_c: dbTask.title_c,
      description_c: dbTask.description_c,
      completed_c: dbTask.completed_c,
      priority_c: dbTask.priority_c,
      due_date_c: dbTask.due_date_c,
      completed_at_c: dbTask.completed_at_c
    };
  }

  // Get all tasks
  async getAll() {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        throw new Error(response.message || 'Failed to fetch tasks');
      }

      const tasks = (response.data || []).map(task => this.mapFromDbFields(task));
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  // Get task by ID
  async getById(id) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response.success || !response.data) {
        throw new Error(`Task with ID ${id} not found`);
      }

      return this.mapFromDbFields(response.data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  // Create new task
  async create(taskData) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const mappedData = this.mapToDbFields(taskData);
      
      const params = {
        records: [mappedData]
      };

      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to create task:', response.message);
        throw new Error(response.message || 'Failed to create task');
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel || 'Field'}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDbFields(successful[0].data);
        }
      }
      
      throw new Error('No successful task creation');
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  // Update existing task
  async update(id, updateData) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const mappedData = this.mapToDbFields(updateData);
      mappedData.Id = id; // Ensure ID is included
      
      const params = {
        records: [mappedData]
      };

      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to update task:', response.message);
        throw new Error(response.message || 'Failed to update task');
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel || 'Field'}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDbFields(successful[0].data);
        }
      }
      
      throw new Error('No successful task update');
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  // Delete task
  async delete(id) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = { 
        RecordIds: [id]
      };

      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        throw new Error(response.message || 'Failed to delete task');
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  // Get tasks by status
  async getByStatus(completed) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "ExactMatch", "Values": [completed]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks by status:', response.message);
        return [];
      }

      return (response.data || []).map(task => this.mapFromDbFields(task));
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error.message || error);
      return [];
    }
  }

  // Get tasks by priority
  async getByPriority(priority) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "ExactMatch", "Values": [priority]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch tasks by priority:', response.message);
        return [];
      }

      return (response.data || []).map(task => this.mapFromDbFields(task));
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error.message || error);
      return [];
    }
  }

  // Search tasks
  async search(query) {
    try {
      const client = this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const searchTerm = query.toLowerCase();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "subOperator": "", "values": [searchTerm]},
                {"fieldName": "description_c", "operator": "Contains", "subOperator": "", "values": [searchTerm]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to search tasks:', response.message);
        return [];
      }

      return (response.data || []).map(task => this.mapFromDbFields(task));
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error.message || error);
      return [];
    }
  }
}

export default new TaskService();