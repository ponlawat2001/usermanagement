import { t } from "elysia";
import { spread } from "../database/utils";
import { user } from "../schemas/user";

// ใช้ spread เพื่อแปลง Drizzle schema ให้เข้ากับ Elysia t.Object
export const userInsertSchema = spread(user, "insert");
export const userSelectSchema = spread(user, "select");

// สร้าง schema สำหรับ create operation
export const createSchemaUser = t.Object({
  username: t.String({
    description: 'Unique username for the user',
    examples: ['johndoe'],
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_]+$',
    error: 'Username must be 3-30 characters and can only contain letters, numbers, and underscores'
  }),
  fullname: t.String({
    description: 'Full name of the user',
    examples: ['John Doe'],
    minLength: 2,
    maxLength: 100,
    error: 'Full name must be 2-100 characters'
  }),
  password: t.String({
    description: 'User password (will be hashed before storage)',
    minLength: 8,
    maxLength: 100,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    examples: ['SecureP@ss123'],
    error: 'Password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number'
  }),
  email: t.String({
    description: 'Email address of the user',
    format: 'email',
    examples: ['john@example.com'],
    error: 'Please provide a valid email address'
  }),
}, {
  description: 'Data required to create a new user account'
});

// สร้าง schema สำหรับการแสดงข้อมูล user (ไม่รวม password)
export const userResponseSchemaUser = t.Object({
  id: t.String({
    description: 'Unique identifier of the user'
  }),
  username: t.String({
    description: 'Unique username of the user'
  }),
  fullname: t.String({
    description: 'Full name of the user'
  }),
  email: t.String({
    description: 'Email address of the user',
    format: 'email'
  }),
  createdAt: t.Date({
    description: 'Date and time when the user was created'
  }),
  updatedAt: t.Date({
    description: 'Date and time of the last update to the user record'
  }),
  isActive: t.Boolean({
    description: 'Indicates whether the user account is active'
  }),
}, {
  description: 'User information returned by the API'
});

// Schema สำหรับ login
export const loginSchemaUser = t.Object({
  usernameOrEmail: t.String({
    description: 'Username or email address for login',
    examples: ['johndoe', 'john@example.com'],
    minLength: 3,
    error: 'Please enter a valid username or email'
  }),
  password: t.String({
    description: 'User password',
    examples: ['********'],
    minLength: 8,
    error: 'Password must be at least 8 characters'
  })
}, {
  description: 'Credentials required for user login'
});

// Schema สำหรับอัพเดทผู้ใช้
export const updateSchemaUser = t.Object({
  fullname: t.Optional(t.String({
    description: 'New full name of the user',
    examples: ['John Smith'],
    minLength: 2,
    maxLength: 100,
    error: 'Full name must be 2-100 characters'
  })),
  email: t.Optional(t.String({
    description: 'New email address of the user',
    format: 'email',
    examples: ['john.smith@example.com'],
    error: 'Please provide a valid email address'
  })),
  password: t.Optional(t.String({
    description: 'New password (will be hashed before storage)',
    minLength: 8,
    maxLength: 100,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    examples: ['NewSecureP@ss456'],
    error: 'Password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number'
  })),
  isActive: t.Optional(t.Boolean({
    description: 'Whether the user account is active',
    examples: [true, false]
  })),
  isSuspend: t.Optional(t.Boolean({
    description: 'Whether the user account is suspended',
    examples: [true, false]
  })),
  isBanned: t.Optional(t.Boolean({
    description: 'Whether the user account is banned',
    examples: [true, false]
  })),
  role: t.Optional(t.String({
    description: 'User role for authorization',
    examples: ['user', 'admin'],
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  })),
}, {
  description: 'Fields that can be updated for a user'
});
