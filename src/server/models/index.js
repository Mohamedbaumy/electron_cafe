import User from './User.js'
import Employee from './Employee.js'
import Customer from './Customer.js'
import EmployeeSession from './EmployeeSession.js'
import Shift from './Shift.js'
import Product from './Product.js'
import Category from './Category.js'
import Discount from './Discount.js'
import Order from './Order.js'
import OrderDetail from './OrderDetail.js'
import Table from './Table.js'

// Associations
User.hasOne(Employee, { foreignKey: 'user_id' })
Employee.belongsTo(User, { foreignKey: 'user_id' })

User.hasOne(Customer, { foreignKey: 'user_id' })
Customer.belongsTo(User, { foreignKey: 'user_id' })

Employee.hasMany(EmployeeSession, { foreignKey: 'employee_id' })
EmployeeSession.belongsTo(Employee, { foreignKey: 'employee_id' })

Employee.hasMany(Shift, { foreignKey: 'employee_id' })
Shift.belongsTo(Employee, { foreignKey: 'employee_id' })

Category.hasMany(Product, { foreignKey: 'category_id' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

Product.hasMany(Discount, { foreignKey: 'product_id' })
Discount.belongsTo(Product, { foreignKey: 'product_id' })

Customer.hasMany(Order, { foreignKey: 'customer_id' })
Order.belongsTo(Customer, { foreignKey: 'customer_id' })

Order.hasMany(OrderDetail, { foreignKey: 'order_id' })
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' })

Product.hasMany(OrderDetail, { foreignKey: 'product_id' })
OrderDetail.belongsTo(Product, { foreignKey: 'product_id' })

Table.hasMany(Order, { foreignKey: 'table_id' })
Order.belongsTo(Table, { foreignKey: 'table_id' })

export default {
  User,
  Employee,
  Customer,
  EmployeeSession,
  Shift,
  Product,
  Category,
  Discount,
  Order,
  OrderDetail,
  Table
}

export {
  User,
  Employee,
  Customer,
  EmployeeSession,
  Shift,
  Product,
  Category,
  Discount,
  Order,
  OrderDetail,
  Table
}
