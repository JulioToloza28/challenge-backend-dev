import { createOrderService, cancelOrderService, getOrderDetailsService, createTransferService } from '../../services/orders.service';
import Order from '../../models/orders.model';
import { OrderData } from '../../interfaces/type';


jest.mock('../../models/orders.model', () => {
  return {
    create: jest.fn(),
    findByPk: jest.fn(),
  };
});

describe('Order Services', () => {
  const mockOrderData: OrderData = {
    userId: 1,
    instrumentId: null,
    side: 'BUY',
    size: 10,
    price: 100,
    type: 'MARKET',
    status: 'NEW',
    datetime: new Date(),
  };

  const mockOrderInstance = {
    ...mockOrderData,
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  it('should create an order successfully', async () => {
    (Order.create as jest.Mock).mockResolvedValue(mockOrderInstance);

    const result = await createOrderService(mockOrderData);

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockOrderData,
        datetime: expect.any(Date),
      })
    );
    expect(result).toEqual(mockOrderInstance);
  });

  
  it('should throw an error if the price is invalid', async () => {
    const invalidOrderData: OrderData = {
      userId: 1,
      side: 'INVALID' as 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT', 
      size: 10,
      type: 'LIMIT',
      price: -10, 
      status: 'NEW',
    };

    await expect(createOrderService(invalidOrderData)).rejects.toThrow('Invalid price');
  });

  it('should allow a MARKET order without price', async () => {
    const validOrderData: OrderData = {
      userId: 1,
      side: 'BUY',
      size: 10,
      type: 'MARKET',
      price: undefined, 
      status: 'NEW',
      datetime: new Date(),
    };
  
    const newOrder = await createOrderService(validOrderData);
    expect(newOrder).toBeDefined();
  });

  
  it('should throw an error if required fields are missing in createOrderService', async () => {
    const invalidOrderData: Partial<OrderData> = { side: 'BUY', size: 10, type: 'LIMIT' }; 
    await expect(createOrderService(invalidOrderData as OrderData)).rejects.toThrow("Invalid order data.");
  });

 
  it('should handle unexpected errors in createOrderService', async () => {
    jest.spyOn(Order, 'create').mockRejectedValue(new Error("Unexpected database error"));
    await expect(createOrderService(mockOrderData)).rejects.toThrow("Error creating order: Unexpected database error");
  });

  
  it('should return a message when cancelling a non-cancellable order', async () => {
    const filledOrder = { ...mockOrderInstance, status: "FILLED" };
    (Order.findByPk as jest.Mock).mockResolvedValue(filledOrder);

    const result = await cancelOrderService(1);
    expect(result).toEqual({ message: "Order cannot be cancelled. Current status: FILLED" });
  });

 
  it('should cancel an order successfully', async () => {
    (Order.findByPk as jest.Mock).mockResolvedValue(mockOrderInstance);

    const result = await cancelOrderService(1);

    expect(Order.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Order cancelled successfully' });
  });

  
  it('should return a message when trying to cancel a non-cancellable order', async () => {
    const nonCancellableOrder = { ...mockOrderInstance, status: 'FILLED' };
    (Order.findByPk as jest.Mock).mockResolvedValue(nonCancellableOrder);

    const result = await cancelOrderService(1);
    expect(result).toEqual({ message: 'Order cannot be cancelled. Current status: FILLED' });
  });

  
  it('should handle non-cancellable orders gracefully', async () => {
    const nonCancellableOrder = { ...mockOrderInstance, status: "FILLED" };
    (Order.findByPk as jest.Mock).mockResolvedValue(nonCancellableOrder);

    const result = await cancelOrderService(1);

    expect(result).toEqual({ message: "Order cannot be cancelled. Current status: FILLED" });
    expect(Order.findByPk).toHaveBeenCalledWith(1);
  });

  
  it('should throw a message when trying to cancel an already non-cancellable order', async () => {
    const nonCancellableOrder = { ...mockOrderInstance, status: 'FILLED' };
    (Order.findByPk as jest.Mock).mockResolvedValue(nonCancellableOrder);

    const result = await cancelOrderService(1);
    expect(result).toEqual({ message: `Order cannot be cancelled. Current status: FILLED` });
  });

  
  it('should get order details successfully', async () => {
    (Order.findByPk as jest.Mock).mockResolvedValue(mockOrderInstance);

    const result = await getOrderDetailsService(1);

    expect(Order.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockOrderInstance);
  });

  
  it('should throw an error when getting details of a non-existent order', async () => {
    (Order.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(getOrderDetailsService(1)).rejects.toThrow(/Order not found/);
  });

  
  it('should handle unexpected errors when getting order details', async () => {
    jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error("Database error"));
    await expect(getOrderDetailsService(1)).rejects.toThrow("Error fetching order details.");
  });

 
  it('should create a transfer successfully', async () => {
    jest.spyOn(Order, 'create').mockResolvedValue(mockOrderInstance);
  
    const result = await createTransferService(mockOrderInstance);
  
    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 1,
      side: 'BUY',
      size: 10,
      price: 100,
      type: 'MARKET',
      status: 'NEW',
      instrumentId: null,
      datetime: expect.any(Date),  
    }));
  
    expect(result).toEqual(mockOrderInstance);
  });

  
  it('should throw an error for invalid transfer data', async () => {
    const invalidTransferData: OrderData = { ...mockOrderData, type: 'LIMIT' as any }; // Tipo no permitido

    await expect(createTransferService(invalidTransferData)).rejects.toThrow(/Invalid transfer data./);
  });

  
  it('should throw an error if required fields are missing in createTransferService', async () => {
    const invalidTransferData: Partial<OrderData> = { side: 'BUY', size: 10, type: 'LIMIT' }; // Falta userId
    await expect(createTransferService(invalidTransferData as OrderData)).rejects.toThrow("Invalid transfer data.");
  });

 
  it('should handle unexpected errors in createTransferService', async () => {
    jest.spyOn(Order, 'create').mockRejectedValue(new Error("Unexpected database error"));
    await expect(createTransferService(mockOrderData)).rejects.toThrow("Error creating transfer: Unexpected database error");
  });
});
