import express from 'express';
import orderController from '../controllers/orderController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Welcome message
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/orders', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Orders API' })
);

/**
 * @swagger
 * /orders/get_orders:
 *   post:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 default: ""
 *               page:
 *                 type: integer
 *                 default: 1
 *               length:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Returns a list of orders.
 */
router.post('/orders/get_orders', authenticateToken, orderController.getAllOrders);

/**
 * @swagger
 * /orders/get_order:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Returns an order.
 */
router.get('/orders/get_order', authenticateToken, orderController.getOrder);

/**
 * @swagger
 * /orders/create_order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 default: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T00:00:00.000Z"
 *               total_price:
 *                 type: number
 *                 default: 100
 *     responses:
 *       201:
 *         description: Returns the created order.
 */
router.post('/orders/create_order', authenticateToken, orderController.createOrder);

/**
 * @swagger
 * /orders/update_order:
 *   put:
 *     summary: Update an existing order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 default: 1
 *               customer_id:
 *                 type: integer
 *                 default: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T00:00:00.000Z"
 *               total_price:
 *                 type: number
 *                 default: 120
 *     responses:
 *       200:
 *         description: Returns the updated order.
 */
router.put('/orders/update_order', authenticateToken, orderController.updateOrder);

/**
 * @swagger
 * /orders/delete_order:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Returns a message indicating successful deletion.
 */
router.delete('/orders/delete_order', authenticateToken, orderController.deleteOrder);

export default router;
