import Employee from '../models/Employee.js';

async function getAllEmployees(req, res) {
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

    const total = await Employee.count({ where: searchFilter });
    const data = await Employee.findAll({ where: searchFilter, offset: skip, limit: length });

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
}

async function getEmployee(req, res) {
  try {
    const { id } = req.query;
    const employee = await Employee.findOne({ where: { id } });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function createEmployee(req, res) {
  const data = req.body;
  try {
    const newEmployee = await Employee.create({ ...data });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function updateEmployee(req, res) {
  const data = req.body;
  const { id } = data;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  try {
    await Employee.update(data, { where: { id } });
    const updatedEmployee = await Employee.findOne({ where: { id } });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

async function deleteEmployee(req, res) {
  const { id } = req.body;
  try {
    await Employee.destroy({ where: { id } });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
}

export default {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
