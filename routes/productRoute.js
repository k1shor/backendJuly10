const express = require('express')
const { addProduct, viewProduct, findByCategory, updateProduct, deleteProduct, productDetails, filteredProducts, getRelatedProducts } = require('../controllers/productController')
const { requireSignin } = require('../controllers/userController')
const upload = require('../utils/fileupload')
const { productRules, validation } = require('../validation')
const router = express.Router()

router.post('/addproduct',upload.single('product_image'), productRules, validation, requireSignin, addProduct)
router.get('/productlist', viewProduct)
router.get('/findbycategory/:category_id', findByCategory)
router.put('/product/update/:product_id', requireSignin, updateProduct)
router.delete('/deleteproduct/:id', requireSignin, deleteProduct)
router.get('/productdetails/:id', productDetails)
router.post('/filteredproducts', filteredProducts)
router.get('/relatedproducts/:id', getRelatedProducts)

module.exports = router