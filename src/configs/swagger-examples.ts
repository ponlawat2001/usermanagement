
/**
 * ตัวอย่าง response สำหรับแสดงใน Swagger
 */

// ตัวอย่าง response สำเร็จสำหรับข้อมูลผู้ใช้
export const userSuccessExample = {
  status: 200,
  message: "Operation successful",
  data: {
    id: "clh3e4d0c0000js08dxwl1gh8",
    username: "johndoe",
    fullname: "John Doe",
    email: "john@example.com",
    createdAt: "2023-05-26T10:00:00.000Z",
    updatedAt: "2023-05-26T10:00:00.000Z",
    isActive: true,
    role: "user"
  }
};

// ตัวอย่าง response การสร้างผู้ใช้สำเร็จ
export const userCreatedExample = {
  status: 201,
  message: "User created successfully",
  data: {
    id: "clh3e4d0c0001js08g5tf3m9q",
    username: "janedoe",
    fullname: "Jane Doe",
    email: "jane@example.com",
    createdAt: "2023-05-26T10:00:00.000Z",
    updatedAt: "2023-05-26T10:00:00.000Z",
    isActive: true,
    role: "user"
  }
};

// ตัวอย่าง response รายการผู้ใช้
export const usersListExample = {
  status: 200,
  message: "Users retrieved successfully",
  data: [
    {
      id: "clh3e4d0c0000js08dxwl1gh8",
      username: "johndoe",
      fullname: "John Doe",
      email: "john@example.com",
      createdAt: "2023-05-26T10:00:00.000Z",
      updatedAt: "2023-05-26T10:00:00.000Z",
      isActive: true,
      role: "user"
    },
    {
      id: "clh3e4d0c0001js08g5tf3m9q",
      username: "janedoe",
      fullname: "Jane Doe",
      email: "jane@example.com",
      createdAt: "2023-05-26T10:00:00.000Z",
      updatedAt: "2023-05-26T10:00:00.000Z",
      isActive: true,
      role: "moderator"
    }
  ]
};

// ตัวอย่าง response การเข้าสู่ระบบสำเร็จ
export const loginSuccessExample = {
  status: 200,
  message: "Login successful",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "f8e7c3b2a1d0e9f8c7b6a5d4e3f2c1b0a9d8e7f6...",
    user: {
      id: "clh3e4d0c0000js08dxwl1gh8",
      username: "johndoe",
      email: "john@example.com",
      role: "user"
    }
  }
};

// ตัวอย่าง response refresh token
export const refreshTokenExample = {
  status: 200,
  message: "Token refreshed successfully",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};

// ตัวอย่าง response สำเร็จไม่มีข้อมูล
export const successNoDataExample = {
  status: 200,
  message: "Operation successful",
  data: null
};

// ตัวอย่าง response ข้อผิดพลาดต่างๆ

// 400 Bad Request
export const badRequestExample = {
  status: 400,
  message: "Invalid input data",
  data: {
    errors: [
      {
        field: "username",
        message: "Username must be 3-30 characters and can only contain letters, numbers, and underscores"
      }
    ]
  }
};

// 401 Unauthorized
export const unauthorizedExample = {
  status: 401,
  message: "Authentication required",
  data: null
};

// 403 Forbidden
export const forbiddenExample = {
  status: 403,
  message: "You do not have permission to access this resource",
  data: null
};

// 404 Not Found
export const notFoundExample = {
  status: 404,
  message: "User with id clh3e4d0c0000js08dxwl1gh8 not found",
  data: null
};

// 422 Validation Error
export const validationErrorExample = {
  status: 422,
  message: "Validation failed",
  data: {
    errors: [
      {
        field: "password",
        message: "Password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number"
      }
    ]
  }
};

// 429 Too Many Requests
export const tooManyRequestsExample = {
  status: 429,
  message: "Too many requests, please try again later",
  data: {
    retryAfter: 60,
    limit: 100,
    remaining: 0,
    reset: 1621512345
  }
};

// 500 Server Error
export const serverErrorExample = {
  status: 500,
  message: "Internal server error",
  data: null
};
