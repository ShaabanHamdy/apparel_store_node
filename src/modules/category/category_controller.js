import category_model from "../../../db/models/category_model.js"


// ============================================================
export const createCategory = async (req, res, next) => {
    const category = await category_model.findOne({ name: req.body.name })
    if (category) {
        next(new Error("there is category with the same name"))
    }
    const createCategory = await category_model.create({ name: req.body.name })

    res.json({ message: "success", createCategory })
}
// ================================================================
export const getAllCategories = async (req, res, next) => {
    const category = await category_model.find()
    if (category.length < 1) {
        next(new Error("not categories available"))
    }
    res.json({ message: "success", category })
}


// ======================================================
export const deleteAllCategories = async (req, res, next) => {
    const category = await category_model.deleteMany()
    if (category.deletedCount < 1 ) return next(new Error("not find any categories ", { cause: 409 }))
    res.status(201).json({ message: "success", deletedCount: category.deletedCount })
}


// =========================================================
export const getOneCategory = async (req, res, next) => {
    const category = await category_model.findOne({ _id: req.params.categoryId })
    if (!category) {
        next(new Error("category id fail"))
    }
    res.json({ message: "success", category })
}    
