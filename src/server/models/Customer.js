import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Customer = sequelize.define(
  'Customer',
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
    debt: DataTypes.DECIMAL
  },
  {
    tableName: 'customers',
    timestamps: false
  }
);

export default Customer;
