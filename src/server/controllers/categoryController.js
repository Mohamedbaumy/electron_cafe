import Category from '../models/Category.js';

async function getAllCategories(req, res) {
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

    const total = await Category.count({ where: searchFilter });
    const data = await Category.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getCategory(req, res) {
  try {
    const { id } = req.query;
    const category = await Category.findOne({ where: { id } });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createCategory(req, res) {
  const data = req.body;
  try {
    const newCategory = await Category.create({ ...data });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateCategory(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Category.update(data, { where: { id } });
    const updatedCategory = await Category.findOne({ where: { id } });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.body;
  try {
    await Category.destroy({ where: { id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
