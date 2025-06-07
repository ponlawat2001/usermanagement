/** @format */

import { t } from 'elysia'
import { ResponseHandler } from '../utils/response.utils'

// Schema สำหรับ login
export const loginSchemaUser = t.Object(
  {
    usernameOrEmail: t.String({
      description: 'Username or email address for login',
      examples: ['johndoe', 'john@example.com'],
      minLength: 3,
      error: ResponseHandler.error('Please enter a valid username or email', 422),
    }),
    password: t.String({
      description: 'User password',
      examples: ['********'],
      minLength: 8,
      error: ResponseHandler.error('Password must be at least 8 characters long', 422),
    }),
  },
  {
    description: 'Credentials required for user login',
  }
)

// สร้าง schema สำหรับ refresh token
export const refreshTokenSchema = t.Object({
  refreshToken: t.String({
    description: 'The refresh token issued during login',
    minLength: 10,
  }),
})
