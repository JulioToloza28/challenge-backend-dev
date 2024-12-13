import { Request, Response } from "express";
import { createOrderService, cancelOrderService, getOrderDetailsService, createTransferService } from "../services/orders.service";
import { CustomError } from "../errors/CustomError"; 
import Joi from "joi";


const orderSchema = Joi.object({
  userId: Joi.number().required(),
  side: Joi.valid('BUY', 'SELL', 'CASH_IN', 'CASH_OUT').required(),
  size: Joi.number().required(),
  price: Joi.when('type', {
    is: 'LIMIT',
    then: Joi.number().greater(0).required(),
    otherwise: Joi.forbidden(),
  }),
  type: Joi.valid('MARKET', 'LIMIT').required(),
  status: Joi.valid('NEW', 'FILLED', 'REJECTED', 'CANCELLED').required(),
  datetime: Joi.date().required(),
});


const transferSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'userId is required',
    'number.base': 'userId must be a number',
  }),
  side: Joi.string().valid('CASH_IN', 'CASH_OUT').required().messages({
    'any.required': 'side is required',
    'string.base': 'side must be a string',
    'any.only': 'side must be either CASH_IN or CASH_OUT',
  }),
  size: Joi.number().min(1).required().messages({
    'any.required': 'size is required',
    'number.base': 'size must be a number',
    'number.min': 'size must be greater than or equal to 1',
  }),
  type: Joi.string().valid('MARKET').required().messages({
    'any.required': 'type is required',
    'string.base': 'type must be a string',
    'any.only': 'type must be MARKET',
  }),
});

/**
 * Crear una nueva orden
 */
export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      console.error('Invalid order data:', error.details[0].message);
      return res.status(404).json({ message: error.details[0].message });
    }

    const orderData = req.body;
    const newOrder = await createOrderService(orderData);
    return res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal server error', error: error });
  }
};

/**
 * Cancelar una orden
 */
export const cancelOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const result = await cancelOrderService(Number(orderId));

    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(400).json({ message: error });
  }
};

/**
 * Obtener detalles de una orden específica
 */
export const getOrderDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;


    const order = await getOrderDetailsService(Number(orderId));

  
    return res.status(200).json(order);
  } catch (error: unknown) {
    console.error("Error fetching order details:", error);

  
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    
    return res.status(500).json({ message: 'Internal server error' });
  }
};


/**
 * Registrar una transferencia de fondos (CASH_IN o CASH_OUT)
 */
export const createTransfer = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validar los datos de la transferencia con Joi
    console.log("createTransfer")
    const { error } = transferSchema.validate(req.body);
    console.log({error})

    const transferData = req.body;

    // Inicializamos un array para guardar los campos faltantes
const missingFields = [];

// Validamos si los campos faltan
if (!transferData.side) missingFields.push("side");
if (!transferData.type) missingFields.push("type");


// Validamos si los campos tienen valores inválidos
let invalidFields = [];
if (transferData.side && transferData.side !== 'CASH_IN' && transferData.side !== 'CASH_OUT') invalidFields.push("Invalid side value");
if (transferData.type && transferData.type !== 'MARKET') invalidFields.push("Invalid transfer data");


// Construimos el mensaje de error
if (missingFields.length > 0 || invalidFields.length > 0) {
  const errorMessage = [];

  if (missingFields.length > 0) {
    errorMessage.push(`Missing required fields: ${missingFields.join(', ')}`);
  }
  if (invalidFields.length > 0) {
    errorMessage.push(invalidFields.join('. '));
  }

  // Log de los errores para depuración
  console.error('Invalid transfer data:', errorMessage.join('. '));

  // Retornamos el error como respuesta
  return res.status(400).json({ message: errorMessage.join('. ') });
}


    // Llamar al servicio para crear la transferencia
    const newTransfer = await createTransferService(transferData);

    return res.status(201).json({ message: 'Transfer registered successfully', transfer: newTransfer });
  } catch (error) {
    console.error('Error creating transfer:', error);
    return res.status(500).json({ message: 'Error registering the transfer', error: error });
  }
};


