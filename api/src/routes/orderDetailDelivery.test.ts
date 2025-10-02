import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailDeliveryRouter from './orderDetailDelivery';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('OrderDetailDelivery API', () => {
  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);

    // Seed required foreign keys - full dependency chain
    const db = await getDatabase();
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [1, 'HQ One']);
    await db.run(
      'INSERT INTO branches (branch_id, headquarters_id, name) VALUES (?, ?, ?)',
      [1, 1, 'Branch One'],
    );
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Supplier One']);
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-15', 'Order One', 'pending'],
    );
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 'Product One', 99.99, 'PRD-001', 'piece'],
    );
    await db.run(
      'INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 1, 10, 99.99, 'Test order detail'],
    );
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-20', 'Delivery One', 'pending'],
    );

    // Set up express app
    app = express();
    app.use(express.json());
    app.use('/order-detail-deliveries', orderDetailDeliveryRouter);
    // Attach error handler to translate repo errors
    app.use(errorHandler);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('should create a new order detail delivery', async () => {
    const newOrderDetailDelivery = {
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 5,
      notes: 'Partial delivery',
    };
    const response = await request(app)
      .post('/order-detail-deliveries')
      .send(newOrderDetailDelivery);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newOrderDetailDelivery);
    expect(response.body.orderDetailDeliveryId).toBeDefined();
  });

  it('should get all order detail deliveries', async () => {
    const response = await request(app).get('/order-detail-deliveries');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get an order detail delivery by ID', async () => {
    // First create an order detail delivery to test getting it
    const newOrderDetailDelivery = {
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 5,
      notes: 'Test delivery',
    };
    const createResponse = await request(app)
      .post('/order-detail-deliveries')
      .send(newOrderDetailDelivery);
    const orderDetailDeliveryId = createResponse.body.orderDetailDeliveryId;

    const response = await request(app).get(
      `/order-detail-deliveries/${orderDetailDeliveryId}`,
    );
    expect(response.status).toBe(200);
    expect(response.body.orderDetailDeliveryId).toBe(orderDetailDeliveryId);
  });

  it('should update an order detail delivery by ID', async () => {
    // First create an order detail delivery to test updating it
    const newOrderDetailDelivery = {
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 5,
      notes: 'Original notes',
    };
    const createResponse = await request(app)
      .post('/order-detail-deliveries')
      .send(newOrderDetailDelivery);
    const orderDetailDeliveryId = createResponse.body.orderDetailDeliveryId;

    const updatedOrderDetailDelivery = {
      ...newOrderDetailDelivery,
      quantity: 10,
      notes: 'Updated notes',
    };
    const response = await request(app)
      .put(`/order-detail-deliveries/${orderDetailDeliveryId}`)
      .send(updatedOrderDetailDelivery);
    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(10);
    expect(response.body.notes).toBe('Updated notes');
  });

  it('should delete an order detail delivery by ID', async () => {
    // First create an order detail delivery to test deleting it
    const newOrderDetailDelivery = {
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 5,
      notes: 'Delete me',
    };
    const createResponse = await request(app)
      .post('/order-detail-deliveries')
      .send(newOrderDetailDelivery);
    const orderDetailDeliveryId = createResponse.body.orderDetailDeliveryId;

    const response = await request(app).delete(
      `/order-detail-deliveries/${orderDetailDeliveryId}`,
    );
    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing order detail delivery', async () => {
    const response = await request(app).get('/order-detail-deliveries/999');
    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing order detail delivery', async () => {
    const updatedOrderDetailDelivery = {
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 10,
      notes: 'Does not exist',
    };
    const response = await request(app)
      .put('/order-detail-deliveries/999')
      .send(updatedOrderDetailDelivery);
    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting non-existing order detail delivery', async () => {
    const response = await request(app).delete('/order-detail-deliveries/999');
    expect(response.status).toBe(404);
  });
});
