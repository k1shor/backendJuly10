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

// to get filtered products
exports.filteredProducts = async(req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let order = req.query.order ? req.query.order : "ASC" 
    //  ASC, ascending, 1
    let limit = req.query.limit ? Number(req.query.limit) : 9999999
    let skip = req.query.skip ? Number(req.query.skip) : 0

    let Args = {}
    for (let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key === 'product_price'){
                Args[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else{
                Args[key] = req.body.filters[key]
            }
        }
    }

    let filteredProducts = await Product.find(Args).populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip)

    if(!filteredProducts){
        return res.status(400).json({error:"Something went wrong"})
    }
    else{
        res.json({
            filteredProducts,
            size: filteredProducts.length
        })
    }
}

// to get related products
exports.getRelatedProducts = async(req,res) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        let relatedProducts = await Product.find({
            category: product.category,
            _id: {$ne:product._id}
        })
        .sort([['createdAt','-1']])
        .limit(3)
        if(!relatedProducts){
        return res.status(400).json({error:"something went wrong"})
        }
        else{
            res.send(relatedProducts)
        }
    }
}