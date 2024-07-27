import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories', // Assuming Categories table
        key: 'id'
      }
    },
    price: DataTypes.DECIMAL
  },
  {
    tableName: 'products',
    timestamps: false
  }
);

export default Product;
