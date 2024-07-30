import Customer from '../models/Customer.js'

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)
    if (customer) {
      res.json(customer)
    } else {
      res.status(404).json({ error: 'Customer not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body)
    res.status(201).json(newCustomer)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)
    if (customer) {
      await customer.update(req.body)
      res.json(customer)
    } else {
      res.status(404).json({ error: 'Customer not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)
    if (customer) {
      await customer.destroy()
      res.json({ message: 'Customer deleted' })
    } else {
      res.status(404).json({ error: 'Customer not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}
