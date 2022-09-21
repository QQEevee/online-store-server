const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
  async create(req, res) {
    const { name } = req.body
    const type = await Brand.create({ name })
    return res.json(type)
  }
  async getAll(req, res) {
    const types = await Brand.findAll()
    return res.json(types)
  }
  async delete(req, res) {
    const { id } = req.body
    const brand = await Brand.findOne({ where: { id } })
    if (!brand) {
      return ApiError.badRequest('Указан не существующий id')
    }
    await brand.destroy()
    return res
      .status(200)
      .json({ message: `Бренд ${id} был успешно удален`, status: 204 })
  }

  async change(req, res) {
    const { id, name } = req.body
    const brand = await Brand.findOne({ where: { id } })
    if (!brand) {
      return ApiError.badRequest('Указан не существующий id')
    }
    brand.name = name
    await brand.save()
    return res.json(brand)
  }
}

module.exports = new BrandController()
