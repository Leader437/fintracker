import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import Expense from '../models/expense.model.js';
import ApiResponse from '../utils/ApiResponse.js';

const createExpense = asyncHandler(async (req, res) => {
    const { expenseName, expenseCategory, expenseDescription, expenseDate, expenseAmount, expensePriority } = req.body;
    const userId = req.user._id;

    // Best practice: Only trim string fields, check others for null/undefined
    if (
        !expenseName || typeof expenseName !== 'string' || expenseName.trim() === '' ||
        !expenseCategory || typeof expenseCategory !== 'string' || expenseCategory.trim() === '' ||
        expenseDescription === undefined || expenseDescription === null ||
        !expensePriority || typeof expensePriority !== 'string' || expensePriority.trim() === '' ||
        expenseAmount === undefined || expenseAmount === null ||
        expenseDate === undefined || expenseDate === null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const expense = await Expense.create({
        expenseName,
        expenseCategory,
        expenseDescription,
        expenseDate,
        expenseAmount,
        expensePriority,
        createdBy: userId
    });

    // Fetch the created expense without the createdBy field
    const createdExpense = await Expense.findById(expense._id).select('-createdBy');

    // if expense creation failed
    if (!createdExpense) {
        throw new ApiError(500, "Failed to create expense");
    }

    res
    .status(201)
    .json(new ApiResponse(201, createdExpense, "Expense created successfully"));
})

const createExpensesBulk = asyncHandler(async (req, res) => {
    const { expenses } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(expenses) || expenses.length === 0) {
        throw new ApiError(400, "Expenses array is required");
    }

    const formattedExpenses = expenses.map(exp => {
        const {
            expenseName,
            expenseCategory,
            expenseDescription,
            expenseDate,
            expenseAmount,
            expensePriority
        } = exp;

        if (
            !expenseName ||
            !expenseCategory ||
            !expenseDescription ||
            !expenseDate ||
            expenseAmount == null ||
            !expensePriority
        ) {
            throw new ApiError(400, "All fields are required for each expense");
        }

        return {
            expenseName,
            expenseCategory,
            expenseDescription,
            expenseDate,
            expenseAmount,
            expensePriority,
            createdBy: userId
        };
    });

    const createdExpenses = await Expense.insertMany(formattedExpenses, {
        ordered: false
    });

    const sanitizedExpenses = createdExpenses.map(exp => {
        const obj = exp.toObject();
        delete obj.createdBy;
        return obj;
    });

    res
        .status(201)
        .json(new ApiResponse(201, sanitizedExpenses, "Expenses created successfully"));
});


const getExpense = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const allExpenses = await Expense.find({
        createdBy : userId
    })

    if (!allExpenses || allExpenses.length === 0) {
        throw new ApiError(404, "No expenses found for this user");
    }

    res
    .status(200)
    .json(new ApiResponse(200, allExpenses, "Expenses fetched successfully"));
})

const updateExpense = asyncHandler(async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user._id;
    const { expenseName, expenseCategory, expenseDescription, expenseDate, expenseAmount, expensePriority } = req.body;

    // Best practice: Only trim string fields, check others for null/undefined
    if (
        !expenseName || typeof expenseName !== 'string' || expenseName.trim() === '' ||
        !expenseCategory || typeof expenseCategory !== 'string' || expenseCategory.trim() === '' ||
        expenseDescription === undefined || expenseDescription === null ||
        !expensePriority || typeof expensePriority !== 'string' || expensePriority.trim() === '' ||
        expenseAmount === undefined || expenseAmount === null ||
        expenseDate === undefined || expenseDate === null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const expense = await Expense.findOneAndUpdate(
        { _id: expenseId, createdBy: userId },
        {
            expenseName,
            expenseCategory,
            expenseDescription,
            expenseDate,
            expenseAmount,
            expensePriority
        },
        { new: true }
    );

    if (!expense) {
        throw new ApiError(404, "Expense not found or not authorized");
    }

    res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense updated successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user._id;

    const expense = await Expense.findOneAndDelete({ _id: expenseId, createdBy: userId });

    if (!expense) {
        throw new ApiError(404, "Expense not found or not authorized");
    }

    res
    .status(200)
    .json(new ApiResponse(200, null, "Expense deleted successfully"));
});

export {
    createExpense,
    createExpensesBulk,
    getExpense,
    updateExpense,
    deleteExpense
}