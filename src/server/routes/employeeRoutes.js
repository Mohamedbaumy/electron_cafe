import express from 'express';
import employeeController from '../controllers/employeeController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: API for managing employees
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Welcome message
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/employees', authenticateToken, (req, res) =>
  res.status(200).json({ message: 'Welcome to the Employees API' })
);

/**
 * @swagger
 * /employees/get_employees:
 *   post:
 *     summary: Get all employees
 *     tags: [Employees]
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
 *         description: Returns a list of employees.
 */
router.post('/employees/get_employees', authenticateToken, employeeController.getAllEmployees);

/**
 * @swagger
 * /employees/get_employee:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the employee
 *     responses:
 *       200:
 *         description: Returns an employee.
 */
router.get('/employees/get_employee', authenticateToken, employeeController.getEmployee);

/**
 * @swagger
 * /employees/create_employee:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
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
 *               role:
 *                 type: string
 *                 default: "manager"
 *     responses:
 *       201:
 *         description: Returns the created employee.
 */
router.post('/employees/create_employee', authenticateToken, employeeController.createEmployee);

/**
 * @swagger
 * /employees/update_employee:
 *   put:
 *     summary: Update an existing employee
 *     tags: [Employees]
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
 *               role:
 *                 type: string
 *                 default: "manager"
 *     responses:
 *       200:
 *         description: Returns the updated employee.
 */
router.put('/employees/update_employee', authenticateToken, employeeController.updateEmployee);

/**
 * @swagger
 * /employees/delete_employee:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
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
router.delete('/employees/delete_employee', authenticateToken, employeeController.deleteEmployee);

export default router;
