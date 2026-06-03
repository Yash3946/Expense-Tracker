const mongoose = require("mongoose")
const Schema = mongoose.Schema

const budgetSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    maxAmount: {
        type: Number,
    },

    createdDate: {
        type: Date,
        default: Date.now

    },

    endDate: {
        type:Date
    },

    exceedDate: {
        type:Date
    },

    budgetStatus: {
        type: String,
        enum: ["active", "not active"],
        default: "active"
    }

})

module.exports = mongoose.model("budget", budgetSchema)
