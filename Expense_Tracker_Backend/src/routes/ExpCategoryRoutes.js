const router = require("express").Router()
const categoryController = require("../controllers/ExpCatController")
const authMiddleware =require("../middleware/AuthMiddleware")
router.post("/",authMiddleware,categoryController.createExpenseCategory)
module.exports = router