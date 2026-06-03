const router = require("express").Router()
const BudgetController = require("../controllers/BudgetController")
const authMiddleware =require("../middleware/AuthMiddleware")

router.post("/",authMiddleware,BudgetController.CreateBudget)
router.delete("/deletebyid/:id",authMiddleware,BudgetController.deleteBudget)
router.get("/budgets", authMiddleware,BudgetController.getBudgetsByUserId)
router.put("/update",authMiddleware,BudgetController.updateBudget)

module.exports = router