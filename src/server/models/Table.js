import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Table = sequelize.define(
  'Table',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    capacity: DataTypes.INTEGER
  },
  {
    tableName: 'tables',
    timestamps: false
  }
)

export default Table
