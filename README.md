# Todo Application with Sequelize ORM and Swagger

This project is a Todo application that demonstrates the implementation of Sequelize ORM for database operations and Swagger for API documentation.

## Technologies Used

- **Frontend**: React with Next.js
- **Backend**: Express.js
- **Database**: SQLite with Sequelize ORM
- **API Documentation**: Swagger
- **Styling**: Tailwind CSS

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v16 or later)
- npm or pnpm (this project uses pnpm)

## Installation

1. Clone the repository (if not already done)

2. Install dependencies:
```bash
pnpm install
```
or if you're using npm:
```bash
npm install
```

## Running the Application

### Development Mode

1. Start the development server:
```bash
pnpm run dev
```
or with npm:
```bash
npm run dev
```

2. The application will be available at: http://localhost:3000

### Production Mode

1. Build the application:
```bash
pnpm run build
```
or with npm:
```bash
npm run build
```

2. Start the production server:
```bash
pnpm run start
```
or with npm:
```bash
npm run start
```

3. The application will be available at: http://localhost:3000

## API Documentation with Swagger

This project implements Swagger for API documentation:

1. Start the application using one of the methods above
2. Access the Swagger UI at: http://localhost:3000/api-docs
3. From here, you can explore all available API endpoints and test them directly from the browser

## Project Structure

- `src/`: Source code directory
  - `api/`: API-related code
    - `routes/`: Express routes
    - `swagger.js`: Swagger configuration
    - `taskController.js`: Controller for tasks
  - `database/`: Database configuration and models
    - `models/`: Sequelize models
    - `config.js`: Database connection configuration
  - `server.js`: Express server setup
  - `App.jsx`: Main React component
- `public/`: Static assets
- `styles/`: CSS styles
- `components/`: React components

## Sequelize ORM Implementation

This project implements Sequelize ORM with the following features:

- Model definition for Todo items with validation
- CRUD operations using Sequelize methods
- SQLite as the database (file-based for easy demonstration)
- Proper database connection and error handling

## Swagger Implementation

The API is fully documented using Swagger:

- OpenAPI 3.0 specification
- Complete endpoint documentation
- Request and response schemas
- Interactive API testing through Swagger UI

## Database

The application uses SQLite as the database, which is stored in `todo-database.sqlite` at the root of the project. This file will be created automatically when the application first runs.

## Troubleshooting

- If you encounter database connection issues, check if you have proper read/write permissions in the project directory
- If the Swagger documentation doesn't load, make sure the server is running and check the console for any errors


