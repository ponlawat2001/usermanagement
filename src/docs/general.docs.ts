/** @format */

import { t } from 'elysia'
import { apiInformationExample, serverHealthCheckExample } from '../configs/swagger-examples'
import { SwaggerDetails } from '../interfaces/swagger'

export const apiInformationDocs = {
  summary: 'API Information',
  description: 'Get comprehensive information about the UserBase API',
  tags: ['General'],
  responses: {
    '200': {
      description: 'API information retrieved successfully',
      content: {
        'application/json': {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              name: t.String(),
              version: t.String(),
              description: t.String(),
              documentation: t.String(),
              repository: t.String(),
              author: t.String(),
              license: t.String(),
              runtime: t.String(),
              framework: t.String(),
              database: t.String(),
              features: t.Array(t.String()),
              endpoints: t.Object({
                root: t.String(),
                health: t.String(),
                auth: t.Object({
                  login: t.String(),
                  refresh: t.String(),
                  logout: t.String(),
                  changePassword: t.String(),
                }),
                users: t.Object({
                  register: t.String(),
                  findAll: t.String(),
                  findById: t.String(),
                  update: t.String(),
                  delete: t.String(),
                }),
              }),
              security: t.Object({
                authentication: t.String(),
                passwordHashing: t.String(),
                rateLimiting: t.String(),
                cors: t.String(),
              }),
              environment: t.String(),
              timestamp: t.String(),
              uptime: t.String(),
              status: t.String(),
            }),
          }),
          example: apiInformationExample,
        },
      },
    },
  },
} as SwaggerDetails | any

export const healthCheckDocs = {
  summary: 'Health Check',
  description: 'Check service health status',
  tags: ['General'],
  responses: {
    '200': {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: t.Object({
            success: t.Boolean(),
            message: t.String(),
            data: t.Object({
              status: t.String(),
              timestamp: t.String(),
              uptime: t.Number(),
              memoryUsage: t.Object({
                rss: t.Number(),
                heapTotal: t.Number(),
                heapUsed: t.Number(),
                external: t.Number(),
                arrayBuffers: t.Number(),
              }),
              cpuUsage: t.Object({
                user: t.Number(),
                system: t.Number(),
              }),
              environment: t.String(),
              version: t.String(),
              bun: t.String(),
            }),
          }),
          example: serverHealthCheckExample,
        },
      },
    },
  },
} as SwaggerDetails | any
