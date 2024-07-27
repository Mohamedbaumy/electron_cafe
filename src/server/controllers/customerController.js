import Customer from '../models/Customer.js';

async function getAllCustomers(req, res) {
  try {
    const { page, length, search } = req.body;
    const skip = (page - 1) * length;

    const searchFilter = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const total = await Customer.count({ where: searchFilter });
    const data = await Customer.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getCustomer(req, res) {
  try {
    const { id } = req.query;
    const customer = await Customer.findOne({ where: { id } });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createCustomer(req, res) {
  const data = req.body;
  try {
    const newCustomer = await Customer.create({ ...data });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateCustomer(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Customer.update(data, { where: { id } });
    const updatedCustomer = await Customer.findOne({ where: { id } });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteCustomer(req, res) {
  const { id } = req.body;
  try {
    await Customer.destroy({ where: { id } });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
