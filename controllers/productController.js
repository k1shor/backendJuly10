const Product = require('../models/productModel')

exports.addProduct = async(req, res) => {
    let product = new Product({
        product_name : req.body.product_name,
        product_price : req.body.product_price,
        product_description: req.body.product_description,
        category: req.body.category,
        count_in_stock: req.body.count_in_stock,
        product_image: req.file.path 
    })
    product = await product.save()
    if(!product){
        res.status(400).json({error:"Something went wrong"})
    }
    else{
        res.send(product)
    }
}

// view products
exports.viewProduct = async (req, res) => {
    let product = await Product.find().populate('category','category_name')
    if(!product){
        res.status(400).json({error:"Something went wrong"})
    }
    else{
        res.send(product)
    }
}

// view products according to category
exports.findByCategory = async (req,res) => {
    let product = await Product.find({
        category : req.params.category_id
    }).populate('category','category_name')
    if(!product){
        res.status(400).json({error:"Something went wrong"})
    }
    else{
        res.send(product)
    }
}

// update product
exports.updateProduct = async (req,res) => {
    let product = await Product.findByIdAndUpdate(
        req.params.product_id,
        {
            product_name : req.body.product_name,
            product_price : req.body.product_price,
            product_description: req.body.product_description,
            category: req.body.category,
            count_in_stock: req.body.count_in_stock,
            product_image: req.file.path,
            rating: req.body.rating
        },
        {new:true}
    )
    if(!product){
        res.status(400).json({error:"Something went wrong"})
    }
    else{
        res.send(product)
    }
}

// to delete product
exports.deleteProduct = (req,res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product=>{
        if(!product){
            res.status(400).json({error:"Product not found."})
        }
        else{
            res.status(200).json({message: "Product deleted successfully"})
        }
    })
    .catch(err=>res.status(400).json({error:err.message}))
}

// to find product details
exports.productDetails = async (req,res) => {
    let product = await Product.findById(req.params.id).populate('category')
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}