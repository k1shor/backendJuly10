const express = require('express')
const { placeOrder, orderList, orderDetails, updateOrder, userOrder, deleteOrder } = require('../controllers/orderController')
const router = express.Router()

router.post('/placeorder',placeOrder)
router.get('/orderlist', orderList)
router.get('/orderdetails/:id', orderDetails)
router.put('/updateorder/:id', updateOrder)
router.get('/userorders/:user_id', userOrder)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router