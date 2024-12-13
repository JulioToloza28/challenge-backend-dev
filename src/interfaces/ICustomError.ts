/**
 * Interfaz para definir un error personalizado con un código de estado.
 */
export interface ICustomError extends Error {
    statusCode: number;
  }
  