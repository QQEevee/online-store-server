const { Type } = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
  async create(req, res) {
    const { name } = req.body
    const type = await Type.create({ name })
    return res.json(type)
  }
  async getAll(req, res) {
    const { search } = req.query
    let types = [...(await Type.findAll())]
    if (search) {
      types = [...types].filter((type) => type.name.includes(search))
    }
    return res.json(types)
  }

  async delete(req, res) {
    const { id } = req.body
    const type = await Type.findOne({ where: { id } })
    if (!type) {
      return ApiError.badRequest('Указан не существующий id')
    }
    await type.destroy()
    return res
      .status(200)
      .json({ message: `Тип ${id} был успешно удален`, status: 204 })
  }

  async change(req, res) {
    const { id, name } = req.body
    const type = await Type.findOne({ where: { id } })
    if (!type) {
      return ApiError.badRequest('Указан не существующий id')
    }
    type.name = name
    const data = await type.save()
    return res.json(data)
  }
}

module.exports = new TypeController()
