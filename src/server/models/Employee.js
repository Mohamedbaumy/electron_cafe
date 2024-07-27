import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Employee = sequelize.define(
  'Employee',
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
    role: DataTypes.STRING
  },
  {
    tableName: 'employees',
    timestamps: false
  }
);

export default Employee;
