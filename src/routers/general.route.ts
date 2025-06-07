/** @format */

import { Elysia } from 'elysia'
import { ResponseHandler } from '../utils/response.utils'
import { apiInformationDocs, healthCheckDocs } from '../docs/general.docs'

export const generalRoutes = new Elysia()
  .get(
    '/',
    () => {
      return ResponseHandler.success(
        {
          name: 'UserBase - User Management API',
          version: '1.0.0',
          description: 'A robust and scalable TypeScript backend API for comprehensive user management',
          documentation: '/docs',
          repository: 'https://github.com/ponlawat2001/usermanagement',
          author: 'Mimic',
          license: 'MIT',
          runtime: 'Bun',
          framework: 'Elysia.js',
          database: 'PostgreSQL with Drizzle ORM',
          features: [
            'JWT Authentication',
            'Role-based Access Control',
            'Password Hashing',
            'Rate Limiting',
            'Input Validation',
            'Swagger Documentation',
          ],
          endpoints: {
            root: '/ - API information',
            health: '/health - Health check endpoint',
            auth: {
              login: 'POST /auth/login - User authentication',
              refresh: 'POST /auth/refresh-token - Refresh access token',
              logout: 'POST /auth/logout - Invalidate refresh token',
              changePassword: 'POST /auth/change-password - Change user password',
            },
            users: {
              register: 'POST /users/register - Create new user account',
              findAll: 'GET /users/findAll - Get all users (admin only)',
              findById: 'GET /users/:id - Get user by ID',
              update: 'PUT /users/:id - Update user information',
              delete: 'DELETE /users/:id - Soft delete user (admin only)',
            },
          },
          security: {
            authentication: 'Bearer Token (JWT)',
            passwordHashing: 'bcrypt',
            rateLimiting: 'Enabled',
            cors: 'Configured',
          },
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
          uptime: `${Math.floor(process.uptime() / 60)} minutes`,
          status: 'operational',
        },
        'Welcome to UserBase API'
      )
    },
    {
      detail: apiInformationDocs,
    }
  )
  .get(
    '/health',
    () => {
      return ResponseHandler.success(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(process.memoryUsage().external / 1024 / 1024)} MB`,
        arrayBuffers: `${Math.round(process.memoryUsage().arrayBuffers / 1024 / 1024)} MB`,
          },
          cpuUsage: {
        user: `${(process.cpuUsage().user / 1000000).toFixed(2)}%`,
        system: `${(process.cpuUsage().system / 1000000).toFixed(2)}%`,
          },
          environment: process.env.NODE_ENV || 'development',
          version: process.env.npm_package_version || 'unknown',
          bun: process.versions.bun || 'unknown',
        },
        'Service is healthy'
      )
    },
    {
      detail: healthCheckDocs,
    }
  )
