import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './Order.js';
import Product from './Product.js';

const OrderDetail = sequelize.define(
  'OrderDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: 'id'
      }
    },
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    discount_price: DataTypes.DECIMAL
  },
  {
    tableName: 'order_details',
    timestamps: false
  }
);

export default OrderDetail;
