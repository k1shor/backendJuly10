const express = require('express')
const { addCategory, viewCategories, findCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { requireSignin } = require('../controllers/userController')
const { categoryRules, validation } = require('../validation')
const router = express.Router()

// router.post('/addcategory', requireSignin, addCategory)
router.post('/addcategory', categoryRules, validation,requireSignin, addCategory)
router.get('/viewcategories', viewCategories)
router.get('/findcategory/:id', findCategory)
router.put('/updatecategory/:id', requireSignin, updateCategory)
router.delete('/deletecategory/:id', requireSignin, deleteCategory)


module.exports = router