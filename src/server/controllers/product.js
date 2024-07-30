import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const products = await Product.findAll({
      where: { category_id: categoryId }
    })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      await product.update(req.body)
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      await product.destroy()
      res.json({ message: 'Product deleted' })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}
