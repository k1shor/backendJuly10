const express = require('express')
const { addProduct, viewProduct, findByCategory, updateProduct, deleteProduct, productDetails } = require('../controllers/productController')
const upload = require('../utils/fileupload')
const router = express.Router()

router.post('/addproduct',upload.single('product_image'), addProduct)
router.get('/productlist', viewProduct)
router.get('/findbycategory/:category_id', findByCategory)
router.put('/product/update/:product_id',upload.single('product_image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)
router.get('/productdetails/:id', productDetails)

module.exports = router