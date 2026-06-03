const userSchema = require("../models/UserModel")

const bcrypt = require("bcrypt")

const mailSend = require("../utils/MailUtil")

const jwt = require("jsonwebtoken")

const secret = process.env.JWT_SECRET || "secret"

// ================= CREATE USER =================
const createUser = async (req, res) => {

    try {

        const hashedPassword =
            await bcrypt.hash(
                req.body.password,
                10
            )

        const savedUser =
            await userSchema.create({

                ...req.body,

                password:
                    hashedPassword
            })

        try {

            await mailSend(

                savedUser.email,

                "Welcome Mail",

                "Welcome to Expense Manager App"
            )

        } catch (mailErr) {

            console.log(mailErr.message)
        }

        res.status(201).json({

            message:
                "User created successfully",

            data: savedUser
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Error while creating user"
        })
    }
}

// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {

    try {

        const users =
            await userSchema.find()

        res.status(200).json({

            message:
                "Users fetched successfully",

            data: users
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Failed to fetch users"
        })
    }
}

// ================= DELETE USER =================
const deleteUser = async (req, res) => {

    try {

        const deletedUser =
            await userSchema.findByIdAndDelete(
                req.params.id
            )

        res.status(200).json({

            message:
                "User deleted successfully",

            data: deletedUser
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Delete failed"
        })
    }
}

// ================= LOGIN =================
const loginUser = async (req, res) => {

    const { email, password } =
        req.body

    try {

        const foundUser =
            await userSchema.findOne({
                email
            })

        if (!foundUser) {

            return res.status(404).json({

                message:
                    "User not found"
            })
        }

        const isMatch =
            bcrypt.compareSync(

                password,

                foundUser.password
            )

        if (!isMatch) {

            return res.status(401).json({

                message:
                    "Invalid credentials"
            })
        }

        const token = jwt.sign(

            foundUser.toObject(),

            secret
        )

        res.status(200).json({

            message:
                "Login success",

            token
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Login failed"
        })
    }
}

// ================= GET PROFILE =================
const getProfile = async (req, res) => {

    try {

        const user =
            await userSchema.findById(
                req.user._id
            )

        res.status(200).json({

            message:
                "Profile fetched",

            data: user
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Profile fetch failed"
        })
    }
}

// ================= UPLOAD PROFILE PIC =================
const uploadProfilePic = async (req, res) => {

    try {

        console.log(
            "REQ.FILE => ",
            req.file
        )

        if (!req.file) {

            return res.status(400).json({

                message:
                    "No file uploaded"
            })
        }

        const updatedUser =
            await userSchema.findByIdAndUpdate(

                req.user._id,

                {
                    profilePic:
                        req.file.path
                },

                {
                    new: true
                }
            )

        res.status(200).json({

            message:
                "Profile picture updated",

            data: updatedUser
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Profile picture upload failed",

            error: err.message
        })
    }
}

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {

    try {

        const updatedUser =
            await userSchema.findByIdAndUpdate(

                req.user._id,

                {
                    firstName:
                        req.body.firstName,

                    lastName:
                        req.body.lastName,

                    age:
                        req.body.age,

                    gender:
                        req.body.gender
                },

                {
                    new: true
                }
            )

        res.status(200).json({

            message:
                "Profile updated successfully",

            data: updatedUser
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Update failed"
        })
    }
}

module.exports = {

    createUser,

    getAllUsers,

    deleteUser,

    loginUser,

    getProfile,

    uploadProfilePic,

    updateProfile
}