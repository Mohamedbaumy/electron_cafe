import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import {
  User,
  Employee,
  Customer,
  Product,
  Category,
  Order,
  OrderDetail,
  Discount,
  Shift
} from './models/index.js'
import sequelize from './config/db.js'

async function seedDatabase() {
  await sequelize.sync({ force: true })

  // Generate Categories
  const categories = []
  for (let i = 0; i < 5; i++) {
    const category = await Category.create({
      name: faker.commerce.department()
    })
    categories.push(category)
  }

  // Generate Products
  const products = []
  for (let i = 0; i < 20; i++) {
    const product = await Product.create({
      name: faker.commerce.productName(),
      category_id: faker.helpers.arrayElement(categories).id,
      price: parseFloat(faker.commerce.price())
    })
    products.push(product)
  }

  // Generate Admin User
  const hashedAdminPassword = await bcrypt.hash('admin', 10)
  const adminUser = await User.create({
    username: 'admin',
    password: hashedAdminPassword,
    name: 'Admin User',
    role: 'admin',
    phone: faker.phone.number()
  })

  // Generate Other Users, Employees and Customers
  const users = [adminUser]
  const employees = []
  const customers = []
  for (let i = 0; i < 9; i++) {
    // reduced to 9 since we already created 1 admin
    const role = faker.helpers.arrayElement(['employee', 'customer'])
    const user = await User.create({
      username: faker.internet.userName(),
      password: await bcrypt.hash(faker.internet.password(), 10),
      name: faker.person.fullName(),
      role: role,
      phone: faker.phone.number()
    })
    users.push(user)

    if (role === 'employee') {
      const employee = await Employee.create({
        user_id: user.id,
        role: faker.person.jobTitle()
      })
      employees.push(employee)
    } else {
      const customer = await Customer.create({
        user_id: user.id,
        debt: parseFloat(faker.finance.amount())
      })
      customers.push(customer)
    }
  }

  // Generate Orders and OrderDetails
  const orders = []
  const startDate = new Date(2024, 4, 26) // 26th April 2024
  const endDate = new Date(2024, 6, 26) // 26th July 2024
  for (let i = 0; i < 50; i++) {
    const orderDate = faker.date.between({ from: startDate, to: endDate })
    const order = await Order.create({
      customer_id: faker.helpers.arrayElement(customers).id,
      date: orderDate,
      total_price: parseFloat(faker.commerce.price())
    })
    orders.push(order)

    for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
      await OrderDetail.create({
        order_id: order.id,
        product_id: faker.helpers.arrayElement(products).id,
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price()),
        discount_price: parseFloat(faker.commerce.price())
      })
    }
  }

  // Generate Discounts
  for (let i = 0; i < 10; i++) {
    const discountStartDate = faker.date.between({ from: startDate, to: endDate })
    const discountEndDate = faker.date.between({ from: discountStartDate, to: endDate })
    await Discount.create({
      product_id: faker.helpers.arrayElement(products).id,
      discount_rate: parseFloat(faker.number.float({ min: 0.05, max: 0.5 })),
      start_date: discountStartDate,
      end_date: discountEndDate
    })
  }

  // Generate Shifts
  for (let i = 0; i < 30; i++) {
    const shiftStartDate = faker.date.between({ from: startDate, to: endDate })
    const shiftEndDate = new Date(
      shiftStartDate.getTime() + faker.number.int({ min: 4, max: 8 }) * 60 * 60 * 1000
    )
    await Shift.create({
      start_time: shiftStartDate,
      end_time: shiftEndDate,
      employee_id: faker.helpers.arrayElement(employees).id,
      cash_in: parseFloat(faker.finance.amount()),
      cash_out: parseFloat(faker.finance.amount())
    })
  }

  console.log('Seeding completed')
  process.exit()
}

seedDatabase()
