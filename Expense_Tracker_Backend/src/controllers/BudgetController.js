const budgetSchema = require("../models/BudgetModel")

const CreateBudget = async (req,res)=>
{
    try
    {
    const userId = req.user._id;
    const addBudget = await budgetSchema.create({...req.body,userId:userId})

        res.status(201).json({
            message:"budget Saved",
            data : addBudget
        })
    }catch(err){
        res.status(201).json({
            message:"errow while creating budget ",
            err:err
        })
    }
}

const deleteBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletedBudget = await budgetSchema.findOneAndDelete({ _id: req.params.id, userId: userId });
        if (!deletedBudget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }
        res.status(200).json({
            message: "budget deleted successfully",
            data: deletedBudget
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Delete failed",
            err: err.message
        });
    }
}

const getBudgetsByUserId = async (req, res) => {
    try {
        const userId = req.user._id
        const budgets = await budgetSchema.find({ userId })

        res.status(200).json({
            message: "budgets fetched..",
            data: budgets
        })
    } catch (err) {
        res.status(500).json({
            message: "error while fetching budgets..",
            err: err.message
        })
    }
}
const updateBudget = async (req, res) => {

    try {

        // token se logged in user
        const userId = req.user._id

        const updatedBudget =
            await budgetSchema.findOneAndUpdate(
                { userId: userId },
                {
                    ...req.body
                },
                {
                    new: true,
                    sort: { createdDate: -1 }
                }
            )

        if (!updatedBudget) {

            return res.status(404).json({
                message: "Budget not found"
            })
        }

        res.status(200).json({
            message: "Budget updated successfully",
            data: updatedBudget
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Error while updating budget",
            err: err.message
        })
    }
}
module.exports =
{
    CreateBudget,
    deleteBudget,
    getBudgetsByUserId,
    updateBudget
}