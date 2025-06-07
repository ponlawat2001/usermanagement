import { BaseResponse } from "./base";

export interface SwaggerErrorResponse {
  description: string;
  content: {
    "application/json": {
      schema: {
        status: number;
        message: string;
        data: null;
      };
      example: any;
    };
  };
}

export interface SwaggerResponses<T = any[] | any> {
  "200": {
    description: string;
    content: {
      "application/json": {
        schema: {
          status: number;
          message: string;
          data: T;
        };
        example: BaseResponse<T>;
      };
    };
  };
  "401": SwaggerErrorResponse;
  "403": SwaggerErrorResponse;
  "500": SwaggerErrorResponse;
}

export interface SwaggerDetails {
  summary: string;
  description: string;
  tags: string[];
  responses: SwaggerResponses;
}
