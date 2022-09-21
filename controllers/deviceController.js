const uuid = require('uuid')
const path = require('path')
const {
  Device,
  DeviceInfo,
  Rating,
  Review,
  Type,
  Brand,
} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body
      const { img } = req.files
      let fileName = uuid.v4() + '.jpg'
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      })

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query
    page = page || 1
    limit = limit || 12
    let offset = page * limit - limit
    let devices
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset })
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      })
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      })
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      })
    }
    return res.json(devices)
  }

  async getOne(req, res, next) {
    const { id } = req.params
    const device = await Device.findOne({
      where: { id },
      include: [
        { model: DeviceInfo, as: 'info' },
        { model: Brand },
        { model: Type },
      ],
    })
    if (!device) {
      return next(ApiError.badRequest('Устройства не существует'))
    }
    const ratings = await Rating.findAll({ where: { deviceId: id } })
    if (ratings.length !== 0) {
      const rates = ratings.map((r) => (r = r.rate))
      const sumOfRate = rates.reduce((prev, current) => prev + current, 0)
      device.rating = sumOfRate / rates.length
      device.save()
    }

    return res.json(device)
  }

  async delete(req, res) {
    const { id } = req.body
    const device = await Device.findOne({ where: { id } })
    if (!device) {
      return ApiError.badRequest('Указан не существующий id')
    }
    await device.destroy()
    return res
      .status(200)
      .json({ message: `Устройство ${id} было успешно удалено`, status: 204 })
  }

  async change(req, res) {
    let { id, name, price, brandId, typeId, info } = req.body
    const { img } = req.files
    const device = await Device.findOne({ where: { id } })

    if (!device) {
      return ApiError.badRequest('Указан не существующий id')
    }

    let fileName = uuid.v4() + '.jpg'
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    device.img = fileName

    await DeviceInfo.destroy({ where: { deviceId: id } })

    if (info) {
      info = JSON.parse(info)
      info.map((i) => {
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        })
      })
    }

    device.set({
      name,
      price,
      brandId,
      typeId,
      img: fileName,
    })

    await device.save()
    return res.json(device)
  }
}

module.exports = new DeviceController()
