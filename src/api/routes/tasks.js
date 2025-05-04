const express = require("express")
const router = express.Router()
const taskController = require("../taskController")

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated UUID of the task
 *         text:
 *           type: string
 *           description: The task description
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *         category:
 *           type: string
 *           enum: [personal, work, shopping, health]
 *           description: The task category
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority level of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Returns all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await taskController.getAllTasks()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const task = await taskController.createTask(req.body)
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const task = await taskController.updateTask(req.params.id, req.body)
    res.json(task)
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    await taskController.deleteTask(req.params.id)
    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task completion status
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task completion status was toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await taskController.toggleTaskCompletion(req.params.id)
    res.json(task)
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

module.exports = router
