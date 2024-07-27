import express from 'express'
import orderDetailController from '../controllers/orderDetailController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description: API for managing order details
 */

/**
 * @swagger
 * /order_details:
 *   get:
 *     summary: Welcome message
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/order_details', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Order Details API' })
)

/**
 * @swagger
 * /order_details/get_order_details:
 *   post:
 *     summary: Get all order details
 *     tags: [OrderDetails]
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
 *         description: Returns a list of order details.
 */
router.post(
  '/order_details/get_order_details',
  authenticateToken,
  orderDetailController.getAllOrderDetails
)

/**
 * @swagger
 * /order_details/get_order_detail:
 *   get:
 *     summary: Get an order detail by ID
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order detail
 *     responses:
 *       200:
 *         description: Returns an order detail.
 */
router.get(
  '/order_details/get_order_detail',
  authenticateToken,
  orderDetailController.getOrderDetail
)

/**
 * @swagger
 * /order_details/create_order_detail:
 *   post:
 *     summary: Create a new order detail
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *                 default: 1
 *               product_id:
 *                 type: integer
 *                 default: 1
 *               quantity:
 *                 type: integer
 *                 default: 2
 *               price:
 *                 type: number
 *                 default: 20
 *               discount_price:
 *                 type: number
 *                 default: 18
 *     responses:
 *       201:
 *         description: Returns the created order detail.
 */
router.post(
  '/order_details/create_order_detail',
  authenticateToken,
  orderDetailController.createOrderDetail
)

/**
 * @swagger
 * /order_details/update_order_detail:
 *   put:
 *     summary: Update an existing order detail
 *     tags: [OrderDetails]
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
 *               order_id:
 *                 type: integer
 *                 default: 1
 *               product_id:
 *                 type: integer
 *                 default: 1
 *               quantity:
 *                 type: integer
 *                 default: 2
 *               price:
 *                 type: number
 *                 default: 20
 *               discount_price:
 *                 type: number
 *                 default: 18
 *     responses:
 *       200:
 *         description: Returns the updated order detail.
 */
router.put(
  '/order_details/update_order_detail',
  authenticateToken,
  orderDetailController.updateOrderDetail
)

/**
 * @swagger
 * /order_details/delete_order_detail:
 *   delete:
 *     summary: Delete an order detail by ID
 *     tags: [OrderDetails]
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
router.delete(
  '/order_details/delete_order_detail',
  authenticateToken,
  orderDetailController.deleteOrderDetail
)

export default router
