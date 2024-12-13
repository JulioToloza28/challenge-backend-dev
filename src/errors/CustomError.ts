import { ICustomError } from "../interfaces/ICustomError";

/**
 * Clase para manejar errores personalizados con códigos de estado HTTP.
 */
export class CustomError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";

    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
