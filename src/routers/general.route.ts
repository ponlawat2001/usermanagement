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
          name: 'User Management API',
          version: '1.0.0',
          description: 'API for user management and authentication',
          docs: '/docs',
          endpoints: {
            auth: '/api/v1/auth/* - Authentication endpoints',
            users: '/api/v1/users/* - User management endpoints',
          },
          status: 'online',
        },
        'Welcome to User Management API'
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
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
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
