import Product from '../models/Product.js';

async function getAllProducts(req, res) {
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

    const total = await Product.count({ where: searchFilter });
    const data = await Product.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.query;
    const product = await Product.findOne({ where: { id } });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createProduct(req, res) {
  const data = req.body;
  try {
    const newProduct = await Product.create({ ...data });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateProduct(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Product.update(data, { where: { id } });
    const updatedProduct = await Product.findOne({ where: { id } });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.body;
  try {
    await Product.destroy({ where: { id } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
