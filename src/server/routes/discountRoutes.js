import express from 'express';
import discountController from '../controllers/discountController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: API for managing discounts
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Welcome message
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/discounts', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Discounts API' })
);

/**
 * @swagger
 * /discounts/get_discounts:
 *   post:
 *     summary: Get all discounts
 *     tags: [Discounts]
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
 *         description: Returns a list of discounts.
 */
router.post('/discounts/get_discounts', authenticateToken, discountController.getAllDiscounts);

/**
 * @swagger
 * /discounts/get_discount:
 *   get:
 *     summary: Get a discount by ID
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the discount
 *     responses:
 *       200:
 *         description: Returns a discount.
 */
router.get('/discounts/get_discount', authenticateToken, discountController.getDiscount);

/**
 * @swagger
 * /discounts/create_discount:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 default: 1
 *               discount_rate:
 *                 type: number
 *                 default: 0.1
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T00:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-31T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: Returns the created discount.
 */
router.post('/discounts/create_discount', authenticateToken, discountController.createDiscount);

/**
 * @swagger
 * /discounts/update_discount:
 *   put:
 *     summary: Update an existing discount
 *     tags: [Discounts]
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
 *               product_id:
 *                 type: integer
 *                 default: 1
 *               discount_rate:
 *                 type: number
 *                 default: 0.2
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T00:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Returns the updated discount.
 */
router.put('/discounts/update_discount', authenticateToken, discountController.updateDiscount);

/**
 * @swagger
 * /discounts/delete_discount:
 *   delete:
 *     summary: Delete a discount by ID
 *     tags: [Discounts]
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
router.delete('/discounts/delete_discount', authenticateToken, discountController.deleteDiscount);

export default router;
