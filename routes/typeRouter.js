const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/', checkRole('ADMIN'), typeController.delete)
router.put('/', checkRole('ADMIN'), typeController.change)

module.exports = router
