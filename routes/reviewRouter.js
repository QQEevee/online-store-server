const Router = require('express')
const reviewController = require('../controllers/reviewController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, reviewController.create)
router.put('/', authMiddleware, reviewController.change)
router.delete('/', authMiddleware, reviewController.delete)
router.get('/', reviewController.getAll)

module.exports = router
