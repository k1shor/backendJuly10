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

// to view all categories
exports.viewCategories = async (req,res) => {
    let category = await Category.find()
    if(!category){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
}

// to view particular category
exports.findCategory = async (req,res) => {
    let category = await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
}

// find(filter) -> returns all the records after filtering/ returns array
// findById(id) -> returns record matching the id / return object
// findOne(filter) -> returns first record matching the filter / return object


// to update category
exports.updateCategory = async(req,res) => {
    let category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        {
            new:true
        }
    )
    if(!category){
        res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
}

// to delete category
exports.deleteCategory = (req,res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category=>{
        if(!category){
            res.status(400).json({error:"Category does not exist."})
        }
        else{
            res.status(200).json({message: "Category deleted successfully"})
        }
    })
    .catch(err=>res.status(400).json({error:err}))
}

// req.body -> form
// req.params -> url, facebook.com/0asdlfj
// req.query -> url variables, google.com/asdfj?