import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter from './order';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('Order API', () => {
  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);

    // Seed required foreign keys: headquarters id 1 and branch id 1
    const db = await getDatabase();
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [1, 'HQ One']);
    await db.run(
      'INSERT INTO branches (branch_id, headquarters_id, name) VALUES (?, ?, ?)',
      [1, 1, 'Branch One'],
    );

    // Set up express app
    app = express();
    app.use(express.json());
    app.use('/orders', orderRouter);
    // Attach error handler to translate repo errors
    app.use(errorHandler);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('should create a new order', async () => {
    const newOrder = {
      branchId: 1,
      orderDate: '2024-01-15',
      name: 'Office Supplies Order',
      description: 'Monthly office supply order',
      status: 'pending',
    };
    const response = await request(app).post('/orders').send(newOrder);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newOrder);
    expect(response.body.orderId).toBeDefined();
  });

  it('should get all orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get an order by ID', async () => {
    // First create an order to test getting it
    const newOrder = {
      branchId: 1,
      orderDate: '2024-01-15',
      name: 'Test Order',
      description: 'Test order description',
      status: 'pending',
    };
    const createResponse = await request(app).post('/orders').send(newOrder);
    const orderId = createResponse.body.orderId;

    const response = await request(app).get(`/orders/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body.orderId).toBe(orderId);
  });

  it('should update an order by ID', async () => {
    // First create an order to test updating it
    const newOrder = {
      branchId: 1,
      orderDate: '2024-01-15',
      name: 'Original Order',
      description: 'Original description',
      status: 'pending',
    };
    const createResponse = await request(app).post('/orders').send(newOrder);
    const orderId = createResponse.body.orderId;

    const updatedOrder = {
      ...newOrder,
      name: 'Updated Order Name',
      status: 'processing',
    };
    const response = await request(app).put(`/orders/${orderId}`).send(updatedOrder);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Order Name');
    expect(response.body.status).toBe('processing');
  });

  it('should delete an order by ID', async () => {
    // First create an order to test deleting it
    const newOrder = {
      branchId: 1,
      orderDate: '2024-01-15',
      name: 'Delete Me Order',
      description: 'This order will be deleted',
      status: 'pending',
    };
    const createResponse = await request(app).post('/orders').send(newOrder);
    const orderId = createResponse.body.orderId;

    const response = await request(app).delete(`/orders/${orderId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing order', async () => {
    const response = await request(app).get('/orders/999');
    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing order', async () => {
    const updatedOrder = {
      branchId: 1,
      orderDate: '2024-01-15',
      name: 'Non-existent Order',
      description: 'Does not exist',
      status: 'pending',
    };
    const response = await request(app).put('/orders/999').send(updatedOrder);
    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting non-existing order', async () => {
    const response = await request(app).delete('/orders/999');
    expect(response.status).toBe(404);
  });

  it('should handle database errors gracefully when creating with invalid foreign key', async () => {
    const newOrder = {
      branchId: 999, // Non-existent branch
      orderDate: '2024-01-15',
      name: 'Invalid Order',
      description: 'This should fail',
      status: 'pending',
    };
    const response = await request(app).post('/orders').send(newOrder);
    expect([400, 500]).toContain(response.status);
  });
});
