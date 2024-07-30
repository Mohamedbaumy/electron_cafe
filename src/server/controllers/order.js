import Order from '../models/Order.js'
import OrderDetail from '../models/OrderDetail.js'

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderDetail] })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderDetail] })
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ error: 'Order not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createOrder = async (req, res) => {
  const { client, orderDetails, orderStatus, discount, paidAmount, remainingAmount } = req.body
  try {
    const newOrder = await Order.create({
      client_id: client.id,
      status: orderStatus,
      discount,
      paidAmount,
      remainingAmount,
      total_price: orderDetails.reduce((acc, detail) => acc + detail.totalPrice, 0),
      total_quantity: orderDetails.reduce((acc, detail) => acc + detail.quantity, 0)
    })

    for (const detail of orderDetails) {
      await OrderDetail.create({
        order_id: newOrder.id,
        product_id: detail.id,
        quantity: detail.quantity,
        price: detail.price,
        discount_price: detail.discountPrice
      })
    }

    res.status(201).json(newOrder)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (order) {
      await order.update(req.body)
      res.json(order)
    } else {
      res.status(404).json({ error: 'Order not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (order) {
      await order.destroy()
      res.json({ message: 'Order deleted' })
    } else {
      res.status(404).json({ error: 'Order not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}
