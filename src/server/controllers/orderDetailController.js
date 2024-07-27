import OrderDetail from '../models/OrderDetail.js';

async function getAllOrderDetails(req, res) {
  try {
    const { page, length, search } = req.body;
    const skip = (page - 1) * length;

    const searchFilter = search
      ? {
          [Op.or]: [
            { order_id: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const total = await OrderDetail.count({ where: searchFilter });
    const data = await OrderDetail.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getOrderDetail(req, res) {
  try {
    const { id } = req.query;
    const orderDetail = await OrderDetail.findOne({ where: { id } });
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createOrderDetail(req, res) {
  const data = req.body;
  try {
    const newOrderDetail = await OrderDetail.create({ ...data });
    res.status(201).json(newOrderDetail);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateOrderDetail(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await OrderDetail.update(data, { where: { id } });
    const updatedOrderDetail = await OrderDetail.findOne({ where: { id } });
    res.status(200).json(updatedOrderDetail);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteOrderDetail(req, res) {
  const { id } = req.body;
  try {
    await OrderDetail.destroy({ where: { id } });
    res.status(200).json({ message: 'OrderDetail deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllOrderDetails,
  getOrderDetail,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail
};
