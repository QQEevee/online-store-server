const ApiError = require('../error/ApiError')
const { Rating, Review } = require('../models/models')

class RatingController {
  async create(req, res) {
    const { rate, userId, deviceId } = req.body
    let rating = await Rating.findOne({ where: { userId, deviceId } })
    const review = await Review.findOne({ where: { userId, deviceId } })
    if (rating) {
      rating.rate = rate
      rating.save()
    } else {
      rating = await Rating.create({ userId, deviceId, rate })
    }
    if (review) {
      review.ratingId = rating.id
      review.save()
    }
    return res.json(rating)
  }

  async getOne(req, res, next) {
    const { userId, deviceId } = req.query
    const rating = await Rating.findOne({ where: { userId, deviceId } })
    if (!rating) {
      return res.json({})
    }
    return res.json(rating)
  }
}

module.exports = new RatingController()
