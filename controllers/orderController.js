const Order = require('../models/orderModel')
const OrderItems = require('../models/orderItemsModel')

exports.placeOrder = async(req,res) => {
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (order)=>{
            let orderItems = new OrderItems({
                product: order.product,
                quantity: order.quantity
            })
            orderItems = await orderItems.save()
            return orderItems._id
        })
    )

    let individualPriceArray = await Promise.all(
        orderItemsIds.map(async(order)=>{
            let orderItem = await OrderItems.findById(order).populate('product','product_price')
            let individualtotalPrice = orderItem.quantity * orderItem.product.product_price
            return individualtotalPrice
        })
    )

    let total_price = individualPriceArray.reduce((accumulator, current)=>accumulator+ current)
// orderItems: []    -> product, quantity
    // user, total_price, shipping_address, alt_shipping_address, city, country, zipcode, phone

    let order = new Order({
        orderItems: orderItemsIds,
        total_price: total_price,
        user: req.body.user,
        shipping_address: req.body.shipping_address,
        alternate_shipping_address: req.body.alternate_shipping_address,
        city: req.body.city,
        country: req.body.country,
        zipcode: req.body.zipcode,
        phone: req.body.phone
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error: "Failed to place order"})
    }
    res.send(order)
}

// view orders
exports.orderList = async(req, res) => {
    let orders = await Order.find().populate('user','username')
    if(!orders){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(orders)
}

// view order details
exports.orderDetails = async(req,res) => {
    let order = await Order.findById(req.params.id).populate('user','username').populate({path:'orderItems',populate:({path:'product', populate:('category')})})
    if(!order){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(order)
}

// Update order
exports.updateOrder = async (req, res) => {
    let order = await Order.findByIdAndUpdate(req.params.id,{
        status: req.body.status
    },
    {new:true})
    if(!order){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(order)
}

// User orders
exports.userOrder = async(req, res) => {
    let orders = await Order.find({
        user: req.params.user_id
    }).populate({path:'orderItems',populate:({path:'product', populate:('category')})})
    if(!orders){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(orders)
}

// delete order
exports.deleteOrder = async(req,res) => {
    let order = await Order.findByIdAndRemove(req.params.id)
    if(!order){
        return res.status(400).json({error:"Order not found"})
    }
    else{
        order.orderItems.map(async (orderItem)=>{
            let orderItem_deleted = await OrderItems.findByIdAndRemove(orderItem)
            if(!orderItem_deleted){
                return res.status(400).json({error:"Failed to delete order"})
            }
        })
        return res.status(200).json({message: "Order deleted successfully"})
    }
}