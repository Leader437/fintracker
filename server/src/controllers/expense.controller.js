import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import Expense from '../models/expense.model.js';
import ApiResponse from '../utils/ApiResponse.js';

const createExpense = asyncHandler(async (req, res) => {
    const { expenseName, expenseCategory, expenseDescription, expenseDate, expenseAmount, expensePriority } = req.body;
    const userId = req.user._id;

    // checking if any of the info is missing
    if ([expenseName, expenseCategory, expenseDescription, expenseDate, expenseAmount, expensePriority].some(field => field?.trim() === "")) {        // returning true if even one of the field is empty
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

    // checking if any of the info is missing
    if ([expenseName, expenseCategory, expenseDescription, expenseDate, expenseAmount, expensePriority].some(field => field?.trim() === "")) {        // returning true if even one of the field is empty
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
    getExpense,
    updateExpense,
    deleteExpense
}