const expCategory = require("../models/ExpenseCategoryModel")
const createExpenseCategory = async(req,res)=>{

    try{

        console.log("req.user...",req.user)
        //const savedExp = await expCategory.create(req.body) //tile,description,token
       const savedExp = await expCategory.create({...req.body,userId:req.user._id}) //tile,description,token 
        res.status(201).json({
            message:"expCat saved..",
            cat:savedExp
        })
    }catch(err){
        res.status(201).json({
            message:"errow while saving expCat ",
            err:err
        })

    }

}

const getExpensecategoriesByUserId = async(req,res)=>{

    const userId = req.user._id;
    const categories = await expCategory.find({userId:userId})
    res.status(200).json({
        data:categories
    })

}

const deleteMyCategory = async(req,res)=>{
    await expCategory.findByIdAndDelete(req.params.id)

    try
    {
        res.status(201).json({
            message:"category deleted successfully",
            data:expCategory
        })
    }
    catch(err)
    {
        res.status(500).json({
        message:"category is not deleted",
        err:err
    })
    } 
} 


module.exports = {
    createExpenseCategory,getExpensecategoriesByUserId,deleteMyCategory
}