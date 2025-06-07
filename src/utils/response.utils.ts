/** @format */

import { BaseResponse } from '../interfaces/base'

/**
 * สร้าง response object ตามรูปแบบ BaseResponse
 */
export class ResponseHandler {
  /**
   * สร้าง success response (status code 2xx)
   */
  static success<T>(data: T, message = 'Operation successful', status = 200): BaseResponse<T> {
    return {
      status,
      message,
      data,
    }
  }

  /**
   * สร้าง error response (status code 4xx or 5xx)
   */
  static error<T>(message = 'Operation failed', status = 400, data?: T): BaseResponse<T | null> {
    return {
      status,
      message,
      data: data || null,
    }
  }

  /**
   * สร้าง not found response (status code 404)
   */
  static notFound<T>(message = 'Resource not found', data?: T): BaseResponse<T | null> {
    return this.error(message, 404, data)
  }

  /**
   * สร้าง unauthorized response (status code 401)
   */
  static unauthorized<T>(message = 'Unauthorized access', data?: T): BaseResponse<T | null> {
    return this.error(message, 401, data)
  }

  /**
   * สร้าง forbidden response (status code 403)
   */
  static forbidden<T>(message = 'Access forbidden', data?: T): BaseResponse<T | null> {
    return this.error(message, 403, data)
  }

  /**
   * สร้าง server error response (status code 500)
   */
  static serverError<T>(message = 'Internal server error', data?: T): BaseResponse<T | null> {
    return this.error(message, 500, data)
  }

  /**
   * สร้าง validation error response (status code 422)
   */
  static validationError<T>(message = 'Validation failed', data?: T): BaseResponse<T | null> {
    return this.error(message, 422, data)
  }
}
