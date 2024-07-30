import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Table from './Table.js'

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    table_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Table,
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['quick', 'pending', 'debt'],
      defaultValue: 'quick'
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    }
  },
  {
    tableName: 'orders',
    timestamps: true
  }
)

export default Order
