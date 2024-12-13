import Order from "../models/orders.model";
import { OrderData, OrderCreationAttributes } from "../interfaces/type";
import { CustomError } from "../errors/CustomError"; // Asegúrate de que esta importación sea correcta

/**
 * Crear una nueva orden.
 */
export const createOrderService = async (orderData: OrderData): Promise<Order> => {
  try {
   
    if (!orderData.userId || !orderData.side || orderData.size == null || !orderData.type) {
      throw new CustomError("Invalid order data.", 400);
    }

   
    if (orderData.price == null || isNaN(orderData.price) || orderData.price <= 0) {
      throw new CustomError("Invalid price", 400);
    }

    
    const newOrderData: OrderCreationAttributes = {
      ...orderData,
      status: orderData.status ?? "NEW",
      datetime: orderData.datetime ? new Date(orderData.datetime) : new Date(),
      price: orderData.price, 
    };

    
    try {
      const newOrder = await Order.create(newOrderData);
      return newOrder;
    } catch (error) {
      console.error("Error creating order in service:", error);
      if (error instanceof Error) {
        throw new CustomError(`Database error: ${error.message}`, 500); 
      }
      throw new CustomError("Unknown database error", 500);
    }

  } catch (error) {
    console.error("Error creating order in service:", error);
    throw error; 
  }
};

/**
 * Cancelar una orden.
 */
export const cancelOrderService = async (orderId: number): Promise<{ message: string }> => {
  try {
    
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error(`Order with ID ${orderId} not found`);
      throw new CustomError("Order not found", 404); // Usar CustomError con código 404
    }

    if (order.status !== "NEW") {
      return { message: `Order cannot be cancelled. Current status: ${order.status}` };
    }

    
    order.status = "CANCELLED";
    await order.save();
    console.info(`Order with ID ${orderId} cancelled successfully`);
    return { message: "Order cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling order:", error);
    if (error instanceof CustomError) {
      throw error; 
    }
    throw new CustomError(`Error cancelling order: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
};

/**
 * Obtener detalles de una orden.
 */
export const getOrderDetailsService = async (orderId: number): Promise<Order> => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new CustomError("Order not found", 404); 
    }

    return order;
  } catch (error: unknown) {
    console.error("Error fetching order details:", error);

    if (error instanceof CustomError && error.message === "Order not found") {
      throw error; 
    }

    throw new CustomError("Error fetching order details.", 500); 
  }
};

/**
 * Servicio para registrar una transferencia de fondos (CASH_IN o CASH_OUT).
 */
export const createTransferService = async (transferData: OrderData): Promise<Order> => {
  try {
    console.log("Transfer Data:", transferData);
    if (!transferData.userId || !transferData.side || transferData.size == null || transferData.type !== "MARKET") {
      throw new CustomError("Invalid transfer data.", 400); 
    }

    const newTransferData: OrderData = {
      userId: transferData.userId,
      instrumentId: null,
      side: transferData.side,
      size: transferData.size,
      price: transferData.price || 0,
      type: transferData.type,
      status: "NEW",
      datetime: new Date(),
    };

    const newTransfer = await Order.create(newTransferData as any);
    return newTransfer;
  } catch (error: unknown) {
    console.error("Error creating transfer:", error);
    if (error instanceof CustomError) {
      throw error; 
    }
    throw new CustomError(`Error creating transfer: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
};
