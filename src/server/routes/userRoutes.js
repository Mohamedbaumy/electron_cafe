import express from 'express';
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Welcome message
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/users', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Users API' })
);

/**
 * @swagger
 * /users/get_users:
 *   post:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: Returns a list of users.
 */
router.post('/users/get_users', authenticateToken, userController.getAllUsers);

/**
 * @swagger
 * /users/get_user:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Returns a user.
 */
router.get('/users/get_user', authenticateToken, userController.getUser);

/**
 * @swagger
 * /users/create_user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 default: "newuser"
 *               password:
 *                 type: string
 *                 default: "password123"
 *               name:
 *                 type: string
 *                 default: "John Doe"
 *               role:
 *                 type: string
 *                 default: "customer"
 *               phone:
 *                 type: string
 *                 default: "0123456789"
 *     responses:
 *       201:
 *         description: Returns the created user.
 */
router.post('/users/create_user', authenticateToken, userController.createUser);

/**
 * @swagger
 * /users/update_user:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
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
 *               username:
 *                 type: string
 *                 default: "updateduser"
 *               password:
 *                 type: string
 *                 default: "newpassword123"
 *               name:
 *                 type: string
 *                 default: "John Doe"
 *               role:
 *                 type: string
 *                 default: "customer"
 *               phone:
 *                 type: string
 *                 default: "0123456789"
 *     responses:
 *       200:
 *         description: Returns the updated user.
 */
router.put('/users/update_user', authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/delete_user:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
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
router.delete('/users/delete_user', authenticateToken, userController.deleteUser);

export default router;
