const {check, validationResult} = require('express-validator')

exports.categoryRules = [
    check('category_name',"Category name is required").notEmpty()
    .isLength({min:3}).withMessage("Category name must be at least 3 characters")
]

exports.productRules = [
    check('product_name', "Product name is required").notEmpty()
    .isLength({min:3}).withMessage("Product name must be at least 3 characters"),
    check('product_price',"Product price is required").notEmpty()
    .isNumeric().withMessage("Product price must be a number"),
    check('product_description',"Description is required").notEmpty()
    .isLength({min: 30}).withMessage("Description must be at least 30 characters"),
    check('count_in_stock',"Count is required").notEmpty()
    .isNumeric().withMessage("Count must be a number"),
    check('category',"Category is required").notEmpty()
]

exports.userRules = [
    check('username',"username is required").notEmpty()
    .isLength({min:3}).withMessage("Username must be at least 3 characters"),
    check("email","Email is required").notEmpty()
    .isEmail().withMessage("Email format invalid"),
    check("password","password is required").notEmpty()
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase character")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase character")
    .matches(/[0-9]/).withMessage("Password must contain at least one numeric character")
    .matches(/[!@#$%&_-]/).withMessage("Password must contain at least one special character")
    .isLength({min:8}).withMessage("Password must be at least 8 characters")
    .isLength({max:30}).withMessage("Password must not be more than 30 characters")
]

exports.validation = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error: errors.array()[0].msg})
        // return res.status(400).json({error: errors.array().map(error=>error.msg)})
    }
}
