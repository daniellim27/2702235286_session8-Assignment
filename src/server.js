const express = require("express")
const cors = require("cors")
const path = require("path")
const { testConnection, initDatabase } = require("./database")
const taskRoutes = require("./api/routes/tasks")
const swagger = require("./api/swagger")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from the React app in development
app.use(express.static(path.join(__dirname, "../dist")))

// Swagger documentation
app.use("/api-docs", swagger.serve, swagger.setup)

// API routes
app.use("/api/tasks", taskRoutes)

// For any request that doesn't match API routes, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

// Initialize database and start server
const startServer = async () => {
  // Test database connection
  await testConnection()

  // Initialize database (create tables if they don't exist)
  await initDatabase()

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api`)
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
  })
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
  // Close server & exit process
  process.exit(1)
})

// Start the server
startServer()

module.exports = app
