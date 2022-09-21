const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/:id', userController.getData)
router.put('/role', checkRole('ADMIN'), userController.changeRole)
router.get('/', userController.getAll)

module.exports = router
