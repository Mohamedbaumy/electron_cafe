import express from 'express';
import customerController from '../controllers/customerController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Welcome message
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/customers', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Customers API' })
);

/**
 * @swagger
 * /customers/get_customers:
 *   post:
 *     summary: Get all customers
 *     tags: [Customers]
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
 *         description: Returns a list of customers.
 */
router.post('/customers/get_customers', authenticateToken, customerController.getAllCustomers);

/**
 * @swagger
 * /customers/get_customer:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Returns a customer.
 */
router.get('/customers/get_customer', authenticateToken, customerController.getCustomer);

/**
 * @swagger
 * /customers/create_customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 default: 1
 *               debt:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Returns the created customer.
 */
router.post('/customers/create_customer', authenticateToken, customerController.createCustomer);

/**
 * @swagger
 * /customers/update_customer:
 *   put:
 *     summary: Update an existing customer
 *     tags: [Customers]
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
 *               user_id:
 *                 type: integer
 *                 default: 1
 *               debt:
 *                 type: number
 *                 default: 0
 *     responses:
 *       200:
 *         description: Returns the updated customer.
 */
router.put('/customers/update_customer', authenticateToken, customerController.updateCustomer);

/**
 * @swagger
 * /customers/delete_customer:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
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
router.delete('/customers/delete_customer', authenticateToken, customerController.deleteCustomer);

export default router;
