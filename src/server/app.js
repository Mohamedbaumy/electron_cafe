import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import routes from './routes/index.js'
import dotenv from 'dotenv'

import models from './models/index.js'
import sequelize from './config/db.js'
import setupSwagger from './config/swagger.js' // استيراد إعدادات Swagger

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api', routes)

setupSwagger(app)

// const PORT = 5005
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.')
//     return sequelize.sync()
//   })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`)
//     })
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err)
//     createErrorWindow(err)
//   })

export default app
