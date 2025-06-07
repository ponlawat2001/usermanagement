<!-- @format -->

# User Management API

A modern TypeScript backend API for user management built with Elysia.js and Drizzle ORM.

## Features

- **Comprehensive User Management**: Complete CRUD operations for users
- **Authentication System**: JWT-based auth with access & refresh tokens
- **Clean Architecture**: Controllers, services, repositories pattern
- **Data Validation**: Schema-based validation with TypeBox
- **API Documentation**: Swagger UI integration
- **Standardized Responses**: Consistent API response format
- **Security Features**: Password hashing, rate limiting, CORS
- **SQLite Database**: Using Drizzle ORM for database operations

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd userbase
```

2. Install dependencies

```bash
bun install
```

3. Run database migrations

```bash
bun run migrate
```

4. Start the development server

```bash
bun run dev
```

The API will be available at http://localhost:3400, and Swagger documentation at http://localhost:3400/docs.

## API Endpoints

### Authentication

- **POST /auth/login** - Login with username/email and password
- **POST /auth/refresh-token** - Refresh access token
- **POST /auth/logout** - Invalidate refresh token
- **POST /auth/change-password** - Change user password (protected)

### User Management

- **GET /users/findAll** - Get all users (admin only)
- **GET /users/:id** - Get user by ID (protected)
- **POST /users/register** - Create new user
- **PUT /users/:id** - Update user (protected)
- **DELETE /users/:id** - Soft delete user (admin only)

## Architecture

```
src/
├── controllers/     # API endpoints
├── services/        # Business logic
├── repositories/    # Data access
├── schemas/         # Database and validation schemas
├── interfaces/      # Type definitions
├── middlewares/     # Request processing middlewares
├── utils/           # Utility functions
├── database/        # Database connection and migration
├── app.ts           # App configuration
└── main.ts          # Entry point
```

## Response Format

All API endpoints return responses in a standardized format:

```json
{
  "status": 200,           // HTTP status code
  "message": "Success",    // Human readable message
  "data": { ... }          // Response data (null for errors)
}
```

## Security Features

- **Password Hashing**: Secure password storage using bcrypt
- **JWT Authentication**: Short-lived access tokens with refresh mechanism
- **Input Validation**: Comprehensive validation with error messages
- **Rate Limiting**: Protection against abuse and brute force attacks
- **CORS Configuration**: Secure cross-origin resource sharing

## Development

- Build and run the API: `bun run dev`
- Run migrations: `bun run migrate`
- Start production server: `bun run start`
