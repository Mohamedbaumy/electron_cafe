import Discount from '../models/Discount.js';

async function getAllDiscounts(req, res) {
  try {
    const { page, length, search } = req.body;
    const skip = (page - 1) * length;

    const searchFilter = search
      ? {
          [Op.or]: [
            { product_id: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const total = await Discount.count({ where: searchFilter });
    const data = await Discount.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getDiscount(req, res) {
  try {
    const { id } = req.query;
    const discount = await Discount.findOne({ where: { id } });
    res.status(200).json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createDiscount(req, res) {
  const data = req.body;
  try {
    const newDiscount = await Discount.create({ ...data });
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateDiscount(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Discount.update(data, { where: { id } });
    const updatedDiscount = await Discount.findOne({ where: { id } });
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteDiscount(req, res) {
  const { id } = req.body;
  try {
    await Discount.destroy({ where: { id } });
    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount
};
