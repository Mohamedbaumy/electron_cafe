import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Employee from './Employee.js';

const EmployeeSession = sequelize.define(
  'EmployeeSession',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'id'
      }
    },
    login_time: DataTypes.DATE,
    logout_time: DataTypes.DATE
  },
  {
    tableName: 'employee_sessions',
    timestamps: false
  }
);

export default EmployeeSession;
