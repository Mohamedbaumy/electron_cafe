import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['employee', 'customer']
    },
    phone: DataTypes.STRING
  },
  {
    tableName: 'users',
    timestamps: false
  }
);

export default User;
