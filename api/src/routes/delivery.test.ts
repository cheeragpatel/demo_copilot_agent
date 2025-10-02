import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter from './delivery';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('Delivery API', () => {
  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);

    // Seed required foreign key: supplier id 1
    const db = await getDatabase();
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);

    // Set up express app
    app = express();
    app.use(express.json());
    app.use('/deliveries', deliveryRouter);
    // Attach error handler to translate repo errors
    app.use(errorHandler);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('should create a new delivery', async () => {
    const newDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Office Supplies Delivery',
      description: 'Monthly delivery of office supplies',
      status: 'pending',
    };
    const response = await request(app).post('/deliveries').send(newDelivery);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newDelivery);
    expect(response.body.deliveryId).toBeDefined();
  });

  it('should get all deliveries', async () => {
    const response = await request(app).get('/deliveries');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a delivery by ID', async () => {
    // First create a delivery to test getting it
    const newDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Test Delivery',
      description: 'Test delivery description',
      status: 'pending',
    };
    const createResponse = await request(app).post('/deliveries').send(newDelivery);
    const deliveryId = createResponse.body.deliveryId;

    const response = await request(app).get(`/deliveries/${deliveryId}`);
    expect(response.status).toBe(200);
    expect(response.body.deliveryId).toBe(deliveryId);
  });

  it('should update a delivery status', async () => {
    // First create a delivery to test updating it
    const newDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Original Delivery',
      description: 'Original description',
      status: 'pending',
    };
    const createResponse = await request(app).post('/deliveries').send(newDelivery);
    const deliveryId = createResponse.body.deliveryId;

    const response = await request(app).put(`/deliveries/${deliveryId}/status`).send({
      status: 'in-transit',
    });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('in-transit');
  });

  it('should update a delivery by ID', async () => {
    // First create a delivery to test updating it
    const newDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Original Delivery',
      description: 'Original description',
      status: 'pending',
    };
    const createResponse = await request(app).post('/deliveries').send(newDelivery);
    const deliveryId = createResponse.body.deliveryId;

    const updatedDelivery = {
      ...newDelivery,
      name: 'Updated Delivery Name',
      description: 'Updated description',
    };
    const response = await request(app).put(`/deliveries/${deliveryId}`).send(updatedDelivery);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Delivery Name');
    expect(response.body.description).toBe('Updated description');
  });

  it('should delete a delivery by ID', async () => {
    // First create a delivery to test deleting it
    const newDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Delete Me Delivery',
      description: 'This delivery will be deleted',
      status: 'pending',
    };
    const createResponse = await request(app).post('/deliveries').send(newDelivery);
    const deliveryId = createResponse.body.deliveryId;

    const response = await request(app).delete(`/deliveries/${deliveryId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing delivery', async () => {
    const response = await request(app).get('/deliveries/999');
    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing delivery status', async () => {
    const response = await request(app).put('/deliveries/999/status').send({
      status: 'in-transit',
    });
    expect(response.status).toBe(404);
  });

  it('should return 404 when updating non-existing delivery', async () => {
    const updatedDelivery = {
      supplierId: 1,
      deliveryDate: '2024-01-20',
      name: 'Non-existent Delivery',
      description: 'Does not exist',
      status: 'pending',
    };
    const response = await request(app).put('/deliveries/999').send(updatedDelivery);
    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting non-existing delivery', async () => {
    const response = await request(app).delete('/deliveries/999');
    expect(response.status).toBe(404);
  });
});
