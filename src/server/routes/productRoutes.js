import express from 'express';
import productController from '../controllers/productController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Welcome message
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/products', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Products API' })
);

/**
 * @swagger
 * /products/get_products:
 *   post:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Returns a list of products.
 */
router.post('/products/get_products', authenticateToken, productController.getAllProducts);

/**
 * @swagger
 * /products/get_product:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Returns a product.
 */
router.get('/products/get_product', authenticateToken, productController.getProduct);

/**
 * @swagger
 * /products/create_product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "Coffee"
 *               category_id:
 *                 type: integer
 *                 default: 1
 *               price:
 *                 type: number
 *                 default: 10
 *     responses:
 *       201:
 *         description: Returns the created product.
 */
router.post('/products/create_product', authenticateToken, productController.createProduct);

/**
 * @swagger
 * /products/update_product:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 default: "Updated Coffee"
 *               category_id:
 *                 type: integer
 *                 default: 1
 *               price:
 *                 type: number
 *                 default: 12
 *     responses:
 *       200:
 *         description: Returns the updated product.
 */
router.put('/products/update_product', authenticateToken, productController.updateProduct);

/**
 * @swagger
 * /products/delete_product:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
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
router.delete('/products/delete_product', authenticateToken, productController.deleteProduct);

export default router;
