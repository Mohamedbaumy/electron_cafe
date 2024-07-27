import express from 'express';
import shiftController from '../controllers/shiftController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: API for managing shifts
 */

/**
 * @swagger
 * /shifts:
 *   get:
 *     summary: Welcome message
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/shifts', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Shifts API' })
);

/**
 * @swagger
 * /shifts/get_shifts:
 *   post:
 *     summary: Get all shifts
 *     tags: [Shifts]
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
 *         description: Returns a list of shifts.
 */
router.post('/shifts/get_shifts', authenticateToken, shiftController.getAllShifts);

/**
 * @swagger
 * /shifts/get_shift:
 *   get:
 *     summary: Get a shift by ID
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the shift
 *     responses:
 *       200:
 *         description: Returns a shift.
 */
router.get('/shifts/get_shift', authenticateToken, shiftController.getShift);

/**
 * @swagger
 * /shifts/create_shift:
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T08:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T16:00:00.000Z"
 *               employee_id:
 *                 type: integer
 *                 default: 1
 *               cash_in:
 *                 type: number
 *                 default: 1000
 *               cash_out:
 *                 type: number
 *                 default: 800
 *     responses:
 *       201:
 *         description: Returns the created shift.
 */
router.post('/shifts/create_shift', authenticateToken, shiftController.createShift);

/**
 * @swagger
 * /shifts/update_shift:
 *   put:
 *     summary: Update an existing shift
 *     tags: [Shifts]
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
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T08:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 default: "2023-01-01T16:00:00.000Z"
 *               employee_id:
 *                 type: integer
 *                 default: 1
 *               cash_in:
 *                 type: number
 *                 default: 1100
 *               cash_out:
 *                 type: number
 *                 default: 900
 *     responses:
 *       200:
 *         description: Returns the updated shift.
 */
router.put('/shifts/update_shift', authenticateToken, shiftController.updateShift);

/**
 * @swagger
 * /shifts/delete_shift:
 *   delete:
 *     summary: Delete a shift by ID
 *     tags: [Shifts]
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
router.delete('/shifts/delete_shift', authenticateToken, shiftController.deleteShift);

export default router;
