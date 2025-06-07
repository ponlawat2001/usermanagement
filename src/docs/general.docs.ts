/** @format */

import { t } from 'elysia'
import { apiInformationExample, serverHealthCheckExample } from '../configs/swagger-examples'
import { SwaggerDetails } from '../interfaces/swagger'

export const apiInformationDocs = {
  summary: 'API Information',
  description: 'Get general information about the API',
  tags: ['General'],
  responses: {
    '200': {
      description: 'API information retrieved successfully',
      content: {
        'application/json': {
          schema: t.Object({
            success: t.Boolean(),
            message: t.String(),
            data: t.Object({
              name: t.String(),
              version: t.String(),
              description: t.String(),
              environment: t.String(),
              apiVersion: t.String(),
              documentationUrl: t.String(),
              contactEmail: t.String(),
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
