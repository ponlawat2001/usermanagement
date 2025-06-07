/** @format */

import { t } from 'elysia'
import { ResponseHandler } from '../utils/response.utils'

// สร้าง schema สำหรับ create operation
export const createSchemaUser = t.Object(
  {
    username: t.String({
      description: 'Unique username for the user',
      examples: ['johndoe'],
      minLength: 3,
      maxLength: 30,
      pattern: '^[a-zA-Z0-9_]+$',
      error: ResponseHandler.error(
        'Username must be 3-30 characters and can only contain letters, numbers, and underscores',
        422
      ),
    }),
    fullname: t.String({
      description: 'Full name of the user',
      examples: ['John Doe'],
      minLength: 2,
      maxLength: 100,
      error: ResponseHandler.error('Full name must be 2-100 characters', 422),
    }),
    password: t.String({
      description: 'User password (will be hashed before storage)',
      minLength: 8,
      maxLength: 100,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
      examples: ['SecureP@ss123'],
      error: ResponseHandler.error(
        'Password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number',
        422
      ),
    }),
    email: t.String({
      description: 'Email address of the user',
      format: 'email',
      examples: ['john@example.com'],
      error: ResponseHandler.error('Please provide a valid email address', 422),
    }),
  },
  {
    description: 'Data required to create a new user account',
  }
)

// สร้าง schema สำหรับการแสดงข้อมูล user (ไม่รวม password)
export const userResponseSchemaUser = t.Object(
  {
    id: t.String({
      description: 'Unique identifier of the user',
    }),
    username: t.String({
      description: 'Unique username of the user',
    }),
    fullname: t.String({
      description: 'Full name of the user',
    }),
    email: t.String({
      description: 'Email address of the user',
      format: 'email',
    }),
    createdAt: t.Number({
      description: 'Timestamp when the user was created',
    }),
    updatedAt: t.Number({
      description: 'Timestamp of the last update to the user record',
    }),
    isActive: t.Boolean({
      description: 'Indicates whether the user account is active',
    }),
  },
  {
    description: 'User information returned by the API',
  }
)

// Schema สำหรับอัพเดทผู้ใช้
export const updateSchemaUser = t.Object(
  {
    fullname: t.Optional(
      t.String({
        description: 'New full name of the user',
        examples: ['John Smith'],
        minLength: 2,
        maxLength: 100,
        error: ResponseHandler.error('Full name must be 2-100 characters', 422),
      })
    ),
    email: t.Optional(
      t.String({
        description: 'New email address of the user',
        format: 'email',
        examples: ['john.smith@example.com'],
        error: ResponseHandler.error('Please provide a valid email address', 422),
      })
    ),
    password: t.Optional(
      t.String({
        description: 'New password (will be hashed before storage)',
        minLength: 8,
        maxLength: 100,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
        examples: ['NewSecureP@ss456'],
        error: ResponseHandler.error(
          'Password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number',
          422
        ),
      })
    ),
    isActive: t.Optional(
      t.Boolean({
        description: 'Whether the user account is active',
        examples: [true, false],
      })
    ),
    isSuspend: t.Optional(
      t.Boolean({
        description: 'Whether the user account is suspended',
        examples: [true, false],
      })
    ),
    isBanned: t.Optional(
      t.Boolean({
        description: 'Whether the user account is banned',
        examples: [true, false],
      })
    ),
    role: t.Optional(
      t.String({
        description: 'User role for authorization',
        examples: ['user', 'admin'],
        enum: ['user', 'moderator', 'admin'],
        default: 'user',
      })
    ),
  },
  {
    description: 'Fields that can be updated for a user',
  }
)

// Schema แก้ไขรหัสผ่าน
export const changePasswordSchemaUser = t.Object(
  {
    currentPassword: t.String({
      description: 'Current password of the user',
      examples: ['OldSecureP@ss123'],
      minLength: 8,
      error: ResponseHandler.error('Current password must be at least 8 characters long', 422),
    }),
    newPassword: t.String({
      description: 'New password for the user',
      examples: ['NewSecureP@ss456'],
      minLength: 8,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
      error: ResponseHandler.error(
        'New password must be 8-100 characters and include at least one uppercase letter, one lowercase letter, and one number',
        422
      ),
    }),
    confirmNewPassword: t.String({
      description: 'Confirmation of the new password',
      examples: ['NewSecureP@ss456'],
      minLength: 8,
      error: ResponseHandler.error('Please confirm your new password', 422),
    }),
  },
  {
    description: 'Fields required to change the user password',
  }
)
