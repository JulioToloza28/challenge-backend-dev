import request from 'supertest';
import app from '../../app';  

describe('Orders Controller', () => {

  
  const validOrderData = {
    userId: 1,
    side: 'BUY',
    size: 10,
    type: 'LIMIT',
    price: 100,
    status: 'NEW',
    datetime: new Date().toISOString(),
  };

  const validTransferData = {
    userId: 1,
    side: 'CASH_IN',
    size: 100,
    type: 'MARKET',
  };

  
  let createdOrderId: number | null = null; 


  beforeEach(async () => {
    const response = await request(app)
      .post('/orders')
      .send(validOrderData);

    createdOrderId = response.body.id;  
  });

  afterEach(async () => {
    if (createdOrderId) {
      await request(app)
        .delete(`/api/orders/${createdOrderId}`)
        .send();
    }
  });

  
  it('should create a new order successfully', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(validOrderData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(validOrderData.userId);
    expect(response.body.price).toBe(validOrderData.price);
    expect(response.body.status).toBe(validOrderData.status);
  });

  
  it('should create a transfer successfully', async () => {
    const response = await request(app)
      .post('/api/orders/transfer')
      .send(validTransferData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Transfer registered successfully');
    expect(response.body).toHaveProperty('transfer');
  });

 
  it('should cancel an order successfully', async () => {
    const response = await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Order cancelled successfully');
  });

  
  it('should return order details', async () => {
    const response = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdOrderId);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('side');
    expect(response.body).toHaveProperty('status');
  });

  
  it('should return 400 when order data is invalid', async () => {
    const invalidOrderData = {
      userId: 'invalid',  
      side: 'BUY',
      size: 10,
      type: 'LIMIT',
    };

    const response = await request(app)
      .post('/api/orders')
      .send(invalidOrderData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid order data');
  });

 
  it('should return 400 when transfer data is invalid', async () => {
    const invalidTransferData = {
      userId: 'invalid',  
      side: 'CASH_IN',
      size: 1000,
      type: 'INVALID_TYPE',  
    };

    const response = await request(app)
      .post('/api/orders/transfer')
      .send(invalidTransferData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid transfer data');
  });


  
  it('should return 404 when order not found for details', async () => {
    const orderId = 9999;  

    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  
  it('should return 400 when transfer data is incomplete', async () => {
    const incompleteTransferData = {
      userId: 1,
      size: 100,  
    };

    const response = await request(app)
      .post('/api/orders/transfer')
      .send(incompleteTransferData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields: side, type');
  });

  
  it('should return 400 when transfer type is invalid', async () => {
    const invalidTypeTransfer = {
      userId: 1,
      side: 'CASH_IN',
      size: 100,
      type: 'INVALID_TYPE',  
    };

    const response = await request(app)
      .post('/api/orders/transfer')
      .send(invalidTypeTransfer);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid transfer type.');
  });
});
