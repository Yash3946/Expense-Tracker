const router  = require("express").Router()
const userController = require("../controllers/UserController")
router.get("/",userController.getAllUsers)
router.post("/",userController.createUser)
module.exports = router