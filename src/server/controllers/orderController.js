import Order from '../models/Order.js';

async function getAllOrders(req, res) {
  try {
    const { page, length, search } = req.body;
    const skip = (page - 1) * length;

    const searchFilter = search
      ? {
          [Op.or]: [
            { id: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const total = await Order.count({ where: searchFilter });
    const data = await Order.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getOrder(req, res) {
  try {
    const { id } = req.query;
    const order = await Order.findOne({ where: { id } });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createOrder(req, res) {
  const data = req.body;
  try {
    const newOrder = await Order.create({ ...data });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateOrder(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Order.update(data, { where: { id } });
    const updatedOrder = await Order.findOne({ where: { id } });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.body;
  try {
    await Order.destroy({ where: { id } });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
};
