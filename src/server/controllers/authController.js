import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export async function register(req, res) {
  try {
    const { username, password, name, role, phone } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      role,
      phone
    })

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error })
  }
}

export async function login(req, res) {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ where: { username } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' })
    console.log(import.meta.env, '1212')
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ accessToken })
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.stack })
  }
}
