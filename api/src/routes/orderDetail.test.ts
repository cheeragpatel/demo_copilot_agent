import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailRouter from './orderDetail';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('OrderDetail API', () => {
  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);

    // Seed required foreign keys chain
    const db = await getDatabase();
    // headquarters -> branch -> order
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [1, 'HQ One']);
    await db.run('INSERT INTO branches (branch_id, headquarters_id, name) VALUES (?, ?, ?)', [
      1,
      1,
      'Main Branch',
    ]);
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-15T10:00:00Z', 'Test Order', 'pending'],
    );
    // supplier -> product
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 'Test Product', 99.99, 'TEST-001', 'each'],
    );

    // Set up express app
    app = express();
    app.use(express.json());
    app.use('/order-details', orderDetailRouter);
    // Attach error handler to translate repo errors
    app.use(errorHandler);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('should create a new order detail', async () => {
    const newOrderDetail = {
      orderId: 1,
      productId: 1,
      quantity: 5,
      unitPrice: 99.99,
      notes: 'Standard order',
    };
    const response = await request(app).post('/order-details').send(newOrderDetail);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newOrderDetail);
    expect(response.body.orderDetailId).toBeDefined();
  });

  it('should get all order details', async () => {
    const response = await request(app).get('/order-details');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get an order detail by ID', async () => {
    // First create an order detail to test getting it
    const newOrderDetail = {
      orderId: 1,
      productId: 1,
      quantity: 3,
      unitPrice: 99.99,
      notes: 'Test notes',
    };
    const createResponse = await request(app).post('/order-details').send(newOrderDetail);
    const orderDetailId = createResponse.body.orderDetailId;

    const response = await request(app).get(`/order-details/${orderDetailId}`);
    expect(response.status).toBe(200);
    expect(response.body.orderDetailId).toBe(orderDetailId);
  });

  it('should update an order detail by ID', async () => {
    // First create an order detail to test updating it
    const newOrderDetail = {
      orderId: 1,
      productId: 1,
      quantity: 2,
      unitPrice: 99.99,
      notes: 'Original notes',
    };
    const createResponse = await request(app).post('/order-details').send(newOrderDetail);
    const orderDetailId = createResponse.body.orderDetailId;

    const updatedOrderDetail = {
      ...newOrderDetail,
      quantity: 10,
      notes: 'Updated notes',
    };
    const response = await request(app)
      .put(`/order-details/${orderDetailId}`)
      .send(updatedOrderDetail);
    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(10);
    expect(response.body.notes).toBe('Updated notes');
  });

  it('should delete an order detail by ID', async () => {
    // First create an order detail to test deleting it
    const newOrderDetail = {
      orderId: 1,
      productId: 1,
      quantity: 1,
      unitPrice: 99.99,
      notes: 'Delete me',
    };
    const createResponse = await request(app).post('/order-details').send(newOrderDetail);
    const orderDetailId = createResponse.body.orderDetailId;

    const response = await request(app).delete(`/order-details/${orderDetailId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing order detail', async () => {
    const response = await request(app).get('/order-details/999');
    expect(response.status).toBe(404);
  });
});
