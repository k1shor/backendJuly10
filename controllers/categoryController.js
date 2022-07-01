const Category = require('../models/categoryModel')

exports.addCategory = async (req, res) => {
    let category = await Category.findOne({ category_name: req.body.category_name })
    if (!category) {
        let category = new Category({
            category_name: req.body.category_name
        })
        category = await category.save()
        if (!category) {
            return res.status(400).json({ error: "something went wrong" })
        }
        res.send(category)
    }
    else{
        return res.status(400).json({error:"Category already exists"})
    }


}

// req.body -> form
// req.params -> url, facebook.com/0asdlfj
// req.query -> url variables, google.com/asdfj?