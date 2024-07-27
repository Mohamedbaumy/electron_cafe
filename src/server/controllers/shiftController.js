import Shift from '../models/Shift.js';

async function getAllShifts(req, res) {
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

    const total = await Shift.count({ where: searchFilter });
    const data = await Shift.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getShift(req, res) {
  try {
    const { id } = req.query;
    const shift = await Shift.findOne({ where: { id } });
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createShift(req, res) {
  const data = req.body;
  try {
    const newShift = await Shift.create({ ...data });
    res.status(201).json(newShift);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateShift(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Shift.update(data, { where: { id } });
    const updatedShift = await Shift.findOne({ where: { id } });
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteShift(req, res) {
  const { id } = req.body;
  try {
    await Shift.destroy({ where: { id } });
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift
};
