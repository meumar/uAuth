import { HTTPException } from "hono/http-exception";

import { StatusCode } from "hono/utils/http-status";
import {
  error400Message,
  error400Name,
  error401Message,
  error401Name,
  error403Message,
  error403Name,
  error404Message,
  error404Name,
  error409Message,
  error409Name,
} from "../Messages/ErrorExceptions";

export class CustomError extends HTTPException {
  statusCode?: StatusCode;
  name: string;
  data?: any;
  logError?: boolean;
  message: string;

  constructor(
    message: string,
    statusCode?: StatusCode,
    name?: string,
    data?: any,
    logError?: boolean
  ) {
    super(statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = name || "Error";
    this.logError = logError;
    this.data = data;
  }
}

export class Error400Exception extends CustomError {
  constructor(
    message: string = error400Message,
    data?: any,
    logError?: boolean
  ) {
    super(message, 400, error400Name, data, logError);
  }
}

export class Error401Exception extends CustomError {
  constructor(
    message: string = error401Message,
    data?: any,
    logError?: boolean
  ) {
    super(message, 401, error401Name, data, logError);
  }
}

export class Error403Exception extends CustomError {
  constructor(
    message: string = error403Message,
    data?: any,
    logError?: boolean
  ) {
    super(message, 403, error403Name, data, logError);
  }
}

export class Error404Exception extends CustomError {
  constructor(
    message: string = error404Message,
    data?: any,
    logError?: boolean
  ) {
    super(message, 404, error404Name, data, logError);
  }
}

export class Error409Exception extends CustomError {
  constructor(
    message: string = error409Message,
    data?: any,
    logError?: boolean
  ) {
    super(message, 409, error409Name, data, logError);
  }
}
