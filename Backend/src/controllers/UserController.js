const userSchema = require("../models/UserModel")
const bcrypt =  require("bcrypt")
const mailSend = require("../utils/MailUtil")


const createUser = async(req,res)=>{

const hashedpassword = await bcrypt.hash(req.body.password , 10)

try{
        const savedUser = await userSchema.create({
            ...req.body,
            password:hashedpassword
        });

        //mail send (to,subject,text)
        await mailSend (
            savedUser.email,
            "Welcome Mail",
            "Welcome to expense manager app"
        );
        if(savedUser)
        {
            res.status(201).json({
                message: "user created..",
              });
        }
        else
        {
            res.status(500).json({
                message: "user not created..",
              });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
        message: "error while creating user..",
        });
    }
    }
const getAllUsers = async(req,res)=>{

    const query = req.query

    try
    {
        const users = await userSchema.find(query);
        res.status(200).json({
            message: "users",
            data: users,
        });
    }
    catch(err)
    {
        res.status(500).json({
            message: "error while ferching user",
            err: err,
          });
    }
}
const deleteUser = async(req,res)=>{}

module.exports = {
    createUser,getAllUsers,deleteUser
}