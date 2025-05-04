"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faTrash,
  faPencilAlt,
  faPlus,
  faCalendarAlt,
  faFilter,
  faStar,
  faFlag,
  faDatabase,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"

// API base URL for local development
const API_BASE_URL = "http://localhost:3000/api"

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [filter, setFilter] = useState("all")
  const [editingTask, setEditingTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(true)

  // Check if the API is available
  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, { method: "GET" })
      setIsOnline(response.ok)
      return response.ok
    } catch (error) {
      console.error("API is not available:", error)
      setIsOnline(false)
      return false
    }
  }

  // Load tasks from API or localStorage
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      setError(null)

      const apiAvailable = await checkApiStatus()

      if (apiAvailable) {
        try {
          const response = await fetch(`${API_BASE_URL}/tasks`)
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
          }
          const data = await response.json()
          setTasks(data)
        } catch (error) {
          console.error("Error fetching tasks:", error)
          setError("Failed to load tasks from server. Using local storage instead.")
          // Fallback to localStorage
          const storedTasks = localStorage.getItem("tasks")
          if (storedTasks) {
            setTasks(JSON.parse(storedTasks))
          }
        }
      } else {
        // API not available, use localStorage
        setError("Server is not available. Using local storage instead.")
        const storedTasks = localStorage.getItem("tasks")
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
        }
      }

      setIsLoading(false)
    }

    fetchTasks()
  }, [])

  // Save tasks to localStorage as backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const addTask = async () => {
    if (newTask.trim() === "") return

    const taskData = {
      text: newTask,
      completed: false,
      category: newTaskCategory,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
    }

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const newTaskFromServer = await response.json()
        setTasks([newTaskFromServer, ...tasks])
      } catch (error) {
        console.error("Error adding task:", error)
        // Fallback to local addition
        setTasks([{ id: uuidv4(), ...taskData, createdAt: new Date().toISOString() }, ...tasks])
      }
    } else {
      // Offline mode - add to local state only
      setTasks([{ id: uuidv4(), ...taskData, createdAt: new Date().toISOString() }, ...tasks])
    }

    // Reset form
    setNewTask("")
    setNewTaskCategory("personal")
    setNewTaskDueDate("")
    setNewTaskPriority("medium")
  }

  const toggleTaskCompletion = async (task) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${task.id}/toggle`, {
          method: "PATCH",
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const updatedTask = await response.json()
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      } catch (error) {
        console.error("Error toggling task completion:", error)
        // Fallback to local update
        setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
      }
    } else {
      // Offline mode - update local state only
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
    }
  }

  const deleteTask = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        setTasks(tasks.filter((task) => task.id !== id))
      } catch (error) {
        console.error("Error deleting task:", error)
        // Fallback to local deletion
        setTasks(tasks.filter((task) => task.id !== id))
      }
    } else {
      // Offline mode - delete from local state only
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  const startEditingTask = (task) => {
    setEditingTask(task)
    setNewTask(task.text)
    setNewTaskCategory(task.category)
    setNewTaskDueDate(task.dueDate || "")
    setNewTaskPriority(task.priority)
  }

  const updateTask = async () => {
    if (newTask.trim() === "" || !editingTask) return

    const updatedTask = {
      text: newTask,
      category: newTaskCategory,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
    }

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const updatedTaskFromServer = await response.json()
        setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTaskFromServer : task)))
      } catch (error) {
        console.error("Error updating task:", error)
        // Fallback to local update
        setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...updatedTask } : task)))
      }
    } else {
      // Offline mode - update local state only
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...updatedTask } : task)))
    }

    // Reset form
    setEditingTask(null)
    setNewTask("")
    setNewTaskCategory("personal")
    setNewTaskDueDate("")
    setNewTaskPriority("medium")
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setNewTask("")
    setNewTaskCategory("personal")
    setNewTaskDueDate("")
    setNewTaskPriority("medium")
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    if (filter === "high") return task.priority === "high"
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0]
      return task.dueDate === today
    }
    return task.category === filter
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800"
      case "personal":
        return "bg-green-100 text-green-800"
      case "shopping":
        return "bg-purple-100 text-purple-800"
      case "health":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""

    const taskDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const taskDay = new Date(taskDate)
    taskDay.setHours(0, 0, 0, 0)

    if (taskDay.getTime() === today.getTime()) return "Today"
    if (taskDay.getTime() === tomorrow.getTime()) return "Tomorrow"

    return taskDate.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Task Master</h1>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editingTask ? updateTask() : addTask()
                }
              }}
            />

            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={editingTask ? updateTask : addTask}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={editingTask ? faPencilAlt : faPlus} className="mr-2" />
              {editingTask ? "Update Task" : "Add Task"}
            </button>

            {editingTask && (
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "active" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "completed" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "high" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilter("today")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "today" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Due Today
            </button>
            <button
              onClick={() => setFilter("work")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "work" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setFilter("personal")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === "personal" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Personal
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faFilter} className="text-4xl mb-2" />
              <p>No tasks found. Add a new task or change your filter.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                    task.completed ? "border-green-200 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task)}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-indigo-500"
                        }`}
                      >
                        {task.completed && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                      </button>

                      <div className="flex-1">
                        <p className={`text-lg ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                          {task.text}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>

                          {task.dueDate && (
                            <span className="text-xs flex items-center text-gray-600">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
                          )}

                          <span className={`text-xs flex items-center ${getPriorityColor(task.priority)}`}>
                            <FontAwesomeIcon icon={task.priority === "high" ? faFlag : faStar} className="mr-1" />
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingTask(task)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 text-sm text-gray-500 text-center">
            {tasks.length > 0 && <p>{tasks.filter((t) => !t.completed).length} items left to complete</p>}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <FontAwesomeIcon icon={faDatabase} className="mr-2" />
            {isOnline ? "Connected to database with Sequelize ORM" : "Offline mode - tasks saved in local storage"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
