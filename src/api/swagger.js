const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "A simple Todo API with Sequelize ORM",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/api/routes/*.js"], // Path to the API routes
}

const specs = swaggerJsdoc(options)

module.exports = {
  specs,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
}
