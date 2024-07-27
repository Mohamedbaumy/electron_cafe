import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './Customer.js';

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Customer,
        key: 'id'
      }
    },
    date: DataTypes.DATE,
    total_price: DataTypes.DECIMAL
  },
  {
    tableName: 'orders',
    timestamps: false
  }
);

export default Order;
