import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const Discount = sequelize.define(
  'Discount',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: 'id'
      }
    },
    discount_rate: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  },
  {
    tableName: 'discounts',
    timestamps: false
  }
);

export default Discount;
