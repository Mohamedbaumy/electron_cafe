import express from 'express'
import userRoutes from './userRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import customerRoutes from './customerRoutes.js'
import productRoutes from './productRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import orderRoutes from './orderRoutes.js'
import orderDetailRoutes from './orderDetailRoutes.js'
import discountRoutes from './discountRoutes.js'
import shiftRoutes from './shiftRoutes.js'
import authRoutes from './authRoutes.js'

const router = express.Router()

router.use(userRoutes)
router.use(employeeRoutes)
router.use(customerRoutes)
router.use(productRoutes)
router.use(categoryRoutes)
router.use(orderRoutes)
router.use(orderDetailRoutes)
router.use(discountRoutes)
router.use(shiftRoutes)
router.use('/auth', authRoutes)

export default router
