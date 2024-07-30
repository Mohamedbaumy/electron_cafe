import express from 'express'
import { searchClientsAndTables } from '../controllers/client.js'

const router = express.Router()

router.get('/search', searchClientsAndTables)

export default router
