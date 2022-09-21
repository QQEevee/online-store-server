const ApiError = require('../error/ApiError')
const { Basket, BasketDevice, Device } = require('../models/models')

class BasketController {
  async create(req, res, next) {
    const { userId, deviceId } = req.body
    const basket = await Basket.findOne({ where: { userId } })

    let basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    })
    if (basketDevice) {
      return next(ApiError.badRequest('Устройство уже добавлено в корзину'))
    }
    basketDevice = await BasketDevice.create({
      basketId: basket.id,
      deviceId,
    })
    return res.json(basketDevice)
  }

  async getAll(req, res) {
    let { id, limit, page } = req.query

    page = page || 1
    limit = limit || 12
    let offset = page * limit - limit

    const basket = await Basket.findOne({ where: { userId: id } })
    const basketDevices = await BasketDevice.findAndCountAll({
      where: { basketId: basket.id },
      include: { model: Device },
      limit,
      offset,
    })

    return res.json(basketDevices)
  }

  async check(req, res) {
    const { userId, deviceId } = req.query

    const basket = await Basket.findOne({ where: { userId } })
    const devices = []
    const basketDevices = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    })

    return res.json(basketDevices)
  }

  async delete(req, res, next) {
    const { userId, deviceId } = req.body
    const basket = await Basket.findOne({ where: { userId } })

    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    })

    if (!basketDevice) {
      return next(ApiError.badRequest('Устройства нет в корзине'))
    }
    const temp = await basketDevice.destroy()
    return res
      .status(200)
      .json({ message: 'Устройство успешно удалено из корзины', status: 204 })
  }
}

module.exports = new BasketController()
