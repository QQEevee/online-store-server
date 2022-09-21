const Router = require('express')
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()
router.post('/', authMiddleware, basketController.create)
router.get('/', authMiddleware, basketController.getAll)
router.get('/check', authMiddleware, basketController.check)
router.delete('/', authMiddleware, basketController.delete)

module.exports = router
