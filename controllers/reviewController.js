const ApiError = require('../error/ApiError')
const { Review, User, Rating } = require('../models/models')

const include = [{ model: User, model: Rating }, { model: User }]

class ReviewController {
  async create(req, res, next) {
    const { body, userId, deviceId } = req.body
    const checkReview = await Review.findOne({ where: { userId, deviceId } })
    if (checkReview) {
      return next(ApiError.badRequest('Отзыв уже существует'))
    }
    const rating = await Rating.findOne({ where: { userId, deviceId } })
    await Review.create({
      userId,
      deviceId,
      body,
      ratingId: rating ? rating.id : null,
    })

    const review = await Review.findOne({
      where: { userId, deviceId },
      include,
    })
    return res.json(review)
  }

  async change(req, res, next) {
    const { body, userId, deviceId } = req.body

    let review = await Review.findOne({
      where: { userId, deviceId },
      include: [{ model: User }],
    })
    if (!review) {
      return next(ApiError.badRequest('Отзыва не существует'))
    }
    review.body = body
    review.save()

    return res.json(review)
  }

  async delete(req, res, next) {
    const { userId, deviceId } = req.body
    const review = await Review.findOne({ where: { userId, deviceId } })
    if (!review) {
      return next(ApiError.badRequest('Отзыва не существует'))
    }
    await review.destroy()
    return res
      .status(200)
      .json({ message: `Отзыв ${review.id} успешно удален`, status: 204 })
  }

  async getAll(req, res) {
    const { deviceId } = req.query
    const reviews = await Review.findAll({
      where: { deviceId },
      include,
    })
    return res.json(reviews)
  }
}

module.exports = new ReviewController()
