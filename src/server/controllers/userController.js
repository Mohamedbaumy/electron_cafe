import User from '../models/User.js';

async function getAllUsers(req, res) {
  try {
    const { page, length, search } = req.body;
    const skip = (page - 1) * length;

    const searchFilter = search
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const total = await User.count({ where: searchFilter });
    const data = await User.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.query;
    const user = await User.findOne({ where: { id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createUser(req, res) {
  const data = req.body;
  try {
    const newUser = await User.create({ ...data });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateUser(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await User.update(data, { where: { id } });
    const updatedUser = await User.findOne({ where: { id } });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteUser(req, res) {
  const { id } = req.body;
  try {
    await User.destroy({ where: { id } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
