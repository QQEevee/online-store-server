const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')
const basketRouter = require('./basketRouter')
const ratingRouter = require('./ratingRouter')
const reviewRouter = require('./reviewRouter')

router.use('/user', userRouter)
router.use('/basket', basketRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/rating', ratingRouter)
router.use('/review', reviewRouter)

module.exports = router
