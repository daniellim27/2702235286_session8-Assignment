const { DataTypes } = require("sequelize")
const { sequelize } = require("../config")

// Define the Task model
const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "personal",
      validate: {
        isIn: [["personal", "work", "shopping", "health"]],
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: "medium",
      validate: {
        isIn: [["low", "medium", "high"]],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Other model options
    tableName: "tasks",
    timestamps: true, // Enables createdAt and updatedAt
  },
)

module.exports = Task
