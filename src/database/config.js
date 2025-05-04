// Database configuration
const { Sequelize } = require("sequelize")
const path = require("path")

// Configure the database connection for local development with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../todo-database.sqlite"),
  logging: false, // Disable logging SQL queries in console
})

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

// Initialize database
const initDatabase = async () => {
  try {
    // Sync all models with database
    // force: false will not drop tables if they exist
    await sequelize.sync({ force: false })
    console.log("Database synchronized successfully")
  } catch (error) {
    console.error("Error synchronizing database:", error)
  }
}

module.exports = {
  sequelize,
  testConnection,
  initDatabase,
}
