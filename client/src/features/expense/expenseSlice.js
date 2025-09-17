import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    expenses: [
        {
            id: nanoid(),
            name: "rent",
            description: "Monthly house rent payment for October.",
            amount: 370,
            priority: "high",
            category: "rent",
            date: "2023-10-10",
        },
        {
            id: nanoid(),
            name: "electricity bill",
            description: "October electricity bill for apartment.",
            amount: 1200000,
            priority: "medium",
            category: "utilities",
            date: "2023-10-10",
        },
        {
            id: nanoid(),
            name: "groceries",
            description:
                "Bought groceries from supermarket including fruits and vegetables.",
            amount: 90,
            priority: "high",
            category: "food",
            date: "2023-10-11",
        },
        {
            id: nanoid(),
            name: "internet",
            description: "Broadband bill for the month of October.",
            amount: 40,
            priority: "medium",
            category: "utilities",
            date: "2023-10-11",
        },
        {
            id: nanoid(),
            name: "safai ky paisay",
            description: "",
            amount: 50,
            priority: "low",
            category: "maintenance",
            date: "2023-11-10",
        },
        {
            id: nanoid(),
            name: "fuel",
            description: "Petrol refilling.",
            amount: 65,
            priority: "medium",
            category: "transport",
            date: "2023-11-10",
        },
        {
            id: nanoid(),
            name: "dinner",
            description: "Dinner with friends at local restaurant.",
            amount: 45,
            priority: "low",
            category: "food",
            date: "2023-11-11",
        },
        {
            id: nanoid(),
            name: "gym membership",
            description: "Monthly gym subscription fee.",
            amount: 30,
            priority: "medium",
            category: "health",
            date: "2023-11-11",
        },
        {
            id: nanoid(),
            name: "shopping",
            description: "Bought clothes and shoes.",
            amount: 150,
            priority: "low",
            category: "shopping",
            date: "2023-11-12",
        },
        {
            id: nanoid(),
            name: "water bill",
            description: "",
            amount: 25,
            priority: "medium",
            category: "utilities",
            date: "2023-11-12",
        },
    ]
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        addExpense: {
            reducer(state, action) {
                state.expenses.push(action.payload);
            },
            prepare(expense) {
                return {
                    payload: {
                        id: nanoid(),
                        ...expense             // expense is an object which contains the arguments that we passed from the component
                    }
                }
            }
        },
        updateExpense: (state, action) => {
            state.expenses = state.expenses.map(expense => expense.id === action.payload.id ? { ...expense, ...action.payload } : expense);    // only the changed fields of given expense will be updated
        },
        removeExpense: (state, action) => {
            state.expenses = state.expenses.filter(expense => expense.id !== action.payload.id);
        },
    }
});

export const { addExpense, updateExpense, removeExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
