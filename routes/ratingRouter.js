const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.put('/', authMiddleware, ratingController.create)
router.get('/', ratingController.getOne)

module.exports = router
