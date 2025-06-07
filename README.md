<!-- @format -->

# UserBase - User Management API

A robust and scalable TypeScript backend API for comprehensive user management, built with modern technologies including Elysia.js and Drizzle ORM.

## 🚀 Features

- **🔐 Authentication & Authorization**: JWT-based authentication with access and refresh tokens
- **👥 User Management**: Complete CRUD operations with role-based access control
- **📊 Database Integration**: SQLite with Drizzle ORM for type-safe database operations
- **🛡️ Security First**: Password hashing, rate limiting, CORS protection, and input validation
- **📝 API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **🏗️ Clean Architecture**: Separation of concerns with controllers, services, and repositories
- **✅ Data Validation**: Comprehensive validation using TypeBox schemas
- **📦 Standardized Responses**: Consistent API response format across all endpoints
- **🔄 Soft Delete**: User records are soft-deleted for data integrity
- **⚡ High Performance**: Built on Bun runtime for optimal performance

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia.js](https://elysiajs.com/)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: TypeBox
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Bun](https://bun.sh/) (v1.0 or higher)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/userbase.git
cd userbase
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=3400
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_URL=./database.db
NODE_ENV=development
```

4. **Initialize the database**

```bash
bun run migrate
```

5. **Start the development server**

```bash
bun run dev
```

🎉 **The API is now running!**

- API Base URL: http://localhost:3400
- Swagger Documentation: http://localhost:3400/docs

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                | Description                                 | Auth Required |
| ------ | ----------------------- | ------------------------------------------- | ------------- |
| `POST` | `/auth/login`           | User login with username/email and password | ❌            |
| `POST` | `/auth/refresh-token`   | Refresh access token using refresh token    | ❌            |
| `POST` | `/auth/logout`          | Invalidate refresh token                    | ✅            |
| `POST` | `/auth/change-password` | Change user password                        | ✅            |

### User Management Endpoints

| Method   | Endpoint          | Description                        | Auth Required | Admin Only |
| -------- | ----------------- | ---------------------------------- | ------------- | ---------- |
| `GET`    | `/users/findAll`  | Retrieve all users with pagination | ✅            | ✅         |
| `GET`    | `/users/:id`      | Get user details by ID             | ✅            | ❌         |
| `POST`   | `/users/register` | Create new user account            | ❌            | ❌         |
| `PUT`    | `/users/:id`      | Update user information            | ✅            | ❌         |
| `DELETE` | `/users/:id`      | Soft delete user account           | ✅            | ✅         |

### Example API Requests

#### Register a new user

```bash
curl -X POST http://localhost:3400/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3400/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

## 🏗️ Project Structure

```
src/
├── controllers/          # HTTP request handlers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── services/            # Business logic layer
│   ├── auth.service.ts
│   └── user.service.ts
├── repositories/        # Data access layer
│   └── user.repository.ts
├── schemas/            # Database and validation schemas
│   ├── database/
│   └── validation/
├── interfaces/         # TypeScript type definitions
│   ├── auth.interface.ts
│   └── user.interface.ts
├── middlewares/        # Request processing middlewares
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── utils/              # Utility functions
│   ├── hash.util.ts
│   ├── jwt.util.ts
│   └── response.util.ts
├── database/           # Database configuration
│   ├── connection.ts
│   └── migrations/
├── app.ts              # Elysia app configuration
└── main.ts             # Application entry point
```

## 📊 Response Format

All API endpoints return responses in a standardized format:

```typescript
{
  "status": number,        // HTTP status code
  "message": string,       // Human-readable message
  "data": object | null,   // Response payload (null for errors)
  "timestamp": string,     // ISO timestamp
  "path": string          // Request path
}
```

### Success Response Example

```json
{
  "status": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/users/1"
}
```

### Error Response Example

```json
{
  "status": 404,
  "message": "User not found",
  "data": null,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/users/999"
}
```

## 🔒 Security Features

- **🔐 Password Security**: Bcrypt hashing with salt rounds
- **🎟️ JWT Authentication**: Stateless token-based authentication
- **🔄 Token Refresh**: Secure token renewal mechanism
- **⚡ Rate Limiting**: Protection against brute force attacks
- **🌐 CORS Configuration**: Secure cross-origin resource sharing
- **✅ Input Validation**: Comprehensive request validation
- **🛡️ SQL Injection Protection**: Type-safe queries with Drizzle ORM

## 🚀 Deployment

### Production Build

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3400
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
DATABASE_URL=path/to/production/database.db
```

## 🧪 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `bun run dev`     | Start development server with hot reload |
| `bun run start`   | Start production server                  |
| `bun run build`   | Build the application                    |
| `bun run migrate` | Run database migrations                  |
| `bun run test`    | Run test suite                           |
| `bun run lint`    | Run ESLint                               |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](http://localhost:3400/docs)
2. Open an [issue](https://github.com/your-username/userbase/issues)
3. Contact the maintainers

---

Made with ❤️ using TypeScript and Elysia.js
