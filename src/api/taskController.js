const { models } = require("../database")
const { Task } = models

// Controller for task operations
const taskController = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const tasks = await Task.findAll({
        order: [["createdAt", "DESC"]],
      })
      return tasks
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const task = await Task.create(taskData)
      return task
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const [updated] = await Task.update(taskData, {
        where: { id },
      })

      if (updated) {
        const updatedTask = await Task.findByPk(id)
        return updatedTask
      }

      throw new Error("Task not found")
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const deleted = await Task.destroy({
        where: { id },
      })

      if (deleted) {
        return { id }
      }

      throw new Error("Task not found")
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (id) => {
    try {
      const task = await Task.findByPk(id)

      if (task) {
        task.completed = !task.completed
        await task.save()
        return task
      }

      throw new Error("Task not found")
    } catch (error) {
      console.error("Error toggling task completion:", error)
      throw error
    }
  },
}

module.exports = taskController
