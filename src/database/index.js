// Database entry point
const { sequelize, testConnection, initDatabase } = require("./config")
const Task = require("./models/Task")

// Initialize models
const models = {
  Task,
}

module.exports = {
  sequelize,
  testConnection,
  initDatabase,
  models,
}
