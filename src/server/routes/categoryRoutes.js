import express from 'express';
import categoryController from '../controllers/categoryController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Welcome message
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/categories', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Categories API' })
);

/**
 * @swagger
 * /categories/get_categories:
 *   post:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Returns a list of categories.
 */
router.post('/categories/get_categories', authenticateToken, categoryController.getAllCategories);

/**
 * @swagger
 * /categories/get_category:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Returns a category.
 */
router.get('/categories/get_category', authenticateToken, categoryController.getCategory);

/**
 * @swagger
 * /categories/create_category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 default: "Beverages"
 *     responses:
 *       201:
 *         description: Returns the created category.
 */
router.post('/categories/create_category', authenticateToken, categoryController.createCategory);

/**
 * @swagger
 * /categories/update_category:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
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
 *                 default: "Updated Beverages"
 *     responses:
 *       200:
 *         description: Returns the updated category.
 */
router.put('/categories/update_category', authenticateToken, categoryController.updateCategory);

/**
 * @swagger
 * /categories/delete_category:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
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
router.delete('/categories/delete_category', authenticateToken, categoryController.deleteCategory);

export default router;
