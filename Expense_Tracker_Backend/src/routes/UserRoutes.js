const router = require("express").Router()

const userController =
require("../controllers/UserController")

const authMiddleware =
require("../middleware/AuthMiddleware")

const upload =
require("../middleware/UploadMiddleware")

router.get(
    "/users",
    userController.getAllUsers
)

router.delete(
    "/delete/:id",
    userController.deleteUser
)

router.post(
    "/create",
    userController.createUser
)

router.post(
    "/login",
    userController.loginUser
)

router.get(
    "/profile",
    authMiddleware,
    userController.getProfile
)

router.put(
    "/update-profile",
    authMiddleware,
    userController.updateProfile
)

router.put(
    "/profilePic",
    authMiddleware,
    upload.single("profilePic"),
    userController.uploadProfilePic
)

module.exports = router