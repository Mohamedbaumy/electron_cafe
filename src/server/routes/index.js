import express from 'express'
import customerRoutes from './customer.js'
import productRoutes from './product.js'
import orderRoutes from './order.js'
import categoryRoutes from './category.js'
import clientRoutes from './client.js'

const router = express.Router()

router.use('/customers', customerRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/categories', categoryRoutes)
router.use('/clients', clientRoutes)

export default router
