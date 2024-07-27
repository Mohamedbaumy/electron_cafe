import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Employee from './Employee.js';

const Shift = sequelize.define(
  'Shift',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'id'
      }
    },
    cash_in: DataTypes.DECIMAL,
    cash_out: DataTypes.DECIMAL
  },
  {
    tableName: 'shifts',
    timestamps: false
  }
);

export default Shift;
