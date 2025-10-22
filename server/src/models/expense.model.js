import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
    {
        expenseName: {
            type: String,
            required: true,
            min: [3, "give a minimum length of 3"],     // avoid names of 1 or 2 words 
            index: true    // to optimize search queries on expenseName
        },
        expenseCategory: {
            type: String,
            required: true,
            index: true    // to optimize search queries on expenseCategory
        },
        expenseDescription: {
            type: String,
            required: false
        },
        expenseDate: {
            type: Date,
            required: true
        },
        expenseAmount: {
            type: Number,
            required: true,
            min: [0, "Expense amount must be positive"]
        },
        expensePriority: {
            type: String,
            enum: ["low", "medium", "high"],     // restrict values to these options
            default: "medium"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",       // reference to User model
            required: true
        }
    },
    { timestamps: true }
)

const Expense = mongoose.model("Expense", expenseSchema)

export default Expense