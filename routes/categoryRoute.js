const express = require('express')
const { addCategory, viewCategories, findCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const router = express.Router()

router.post('/addcategory', addCategory)
router.get('/viewcategories', viewCategories)
router.get('/findcategory/:id', findCategory)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)


module.exports = router