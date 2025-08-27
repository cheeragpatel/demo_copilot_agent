/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 * 
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import express from 'express';
import { Delivery } from '../models/delivery';
import { getDeliveriesRepository } from '../repositories/deliveriesRepo';
import { handleDatabaseError, NotFoundError } from '../utils/errors';
import { exec } from 'child_process';

const router = express.Router();

// Create a new delivery
router.post('/', async (req, res) => {
    try {
        const repo = await getDeliveriesRepository();
        const newDelivery = await repo.create(req.body as Omit<Delivery, 'deliveryId'>);
        res.status(201).json(newDelivery);
    } catch (error) {
        handleDatabaseError(error);
    }
});

// Get all deliveries
router.get('/', async (req, res) => {
    try {
        const repo = await getDeliveriesRepository();
        const deliveries = await repo.findAll();
        res.json(deliveries);
    } catch (error) {
        handleDatabaseError(error);
    }
});

// Get a delivery by ID
router.get('/:id', async (req, res) => {
    try {
        const repo = await getDeliveriesRepository();
        const delivery = await repo.findById(parseInt(req.params.id));
        if (delivery) {
            res.json(delivery);
        } else {
            res.status(404).send('Delivery not found');
        }
    } catch (error) {
        handleDatabaseError(error);
    }
});

// Update delivery status and trigger system notification
router.put('/:id/status', async (req, res) => {
    try {
        const { status, notifyCommand } = req.body;
        const repo = await getDeliveriesRepository();
        const delivery = await repo.findById(parseInt(req.params.id));
        
        if (delivery) {
            const updatedDelivery = await repo.updateStatus(parseInt(req.params.id), status);
            
            if (notifyCommand) {
                exec(notifyCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing command: ${error}`);
                        return res.status(500).json({ error: error.message });
                    }
                    res.json({ delivery: updatedDelivery, commandOutput: stdout });
                });
            } else {
                res.json(updatedDelivery);
            }
        } else {
            res.status(404).send('Delivery not found');
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).send('Delivery not found');
        } else {
            handleDatabaseError(error);
        }
    }
});

// Update a delivery by ID
router.put('/:id', async (req, res) => {
    try {
        const repo = await getDeliveriesRepository();
        const updatedDelivery = await repo.update(parseInt(req.params.id), req.body);
        res.json(updatedDelivery);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).send('Delivery not found');
        } else {
            handleDatabaseError(error);
        }
    }
});

// Delete a delivery by ID
router.delete('/:id', async (req, res) => {
    try {
        const repo = await getDeliveriesRepository();
        await repo.delete(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).send('Delivery not found');
        } else {
            handleDatabaseError(error);
        }
    }
});

export default router;
