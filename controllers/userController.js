const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const { User, Basket, Review, Device, Rating } = require('../models/models')

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
}

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'))
    }

    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь с таким email уже существует')
      )
    }
    const hashPassword = password
    const user = await User.create({ email, role, password: hashPassword })
    const basket = await Basket.create({ userId: user.id })
    const token = generateJwt(user.id, email, role)
    return res.json({ token })
  }
  async login(req, res, next) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'))
    }
    let comparePassword = password === user.password
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }
    const token = generateJwt(user.id, user.email, user.role)
    return res.json({ token })
  }
  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    return res.json({ token })
  }

  async getData(req, res, next) {
    const { id } = req.params
    const user = await User.findOne({
      where: { id },
    })
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }
    const review = await Review.findAll({
      where: { userId: id },
      include: [{ model: Device }, { model: Rating }],
    })
    return res.json({ email: user.email, role: user.role, review: review })
  }

  async getAll(req, res) {
    const users = await User.findAll({ attributes: ['id', 'email', 'role'] })
    return res.json(users)
  }
  async changeRole(req, res) {
    const { id, role } = req.body
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return ApiError.badRequest('Пользователь не найден')
    }
    user.role = role
    user.save()
    return res.json({ message: 'Роль успешно изменена', status: '204' })
  }
}

module.exports = new UserController()
