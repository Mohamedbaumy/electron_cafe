import { Op } from 'sequelize'
import User from '../models/User.js'
import Table from '../models/Table.js'

export const searchClientsAndTables = async (req, res) => {
  const { name } = req.query
  try {
    const clients = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        },
        role: 'customer'
      },
      include: [
        { model: User, as: 'Customer', through: 'table_users' }
      ]
    })
    const tables = await Table.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    })
    res.json([...clients, ...tables])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
