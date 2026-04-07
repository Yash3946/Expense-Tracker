const router  = require("express").Router()
const userController = require("../controllers/UserController")
router.get("/users",userController.getAllUsers)
router.post("/create",userController.createUser)
router.delete("/delete/:id",userController.deleteUser)
router.post("/login",userController.loginUser)

module.exports = router