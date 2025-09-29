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
            date: "2025-09-10",
        },
        {
            id: nanoid(),
            name: "security",
            description: "Monthly house security payment for October.",
            amount: 320,
            priority: "high",
            category: "rent",
            date: "2025-09-12",
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
        // Added dummy November 2023 entries with different dates
        {
            id: nanoid(),
            name: "movie night",
            description: "Cinema tickets.",
            amount: 28,
            priority: "low",
            category: "entertainment",
            date: "2023-11-01",
        },
        {
            id: nanoid(),
            name: "pharmacy",
            description: "Medicine purchase.",
            amount: 18,
            priority: "medium",
            category: "health",
            date: "2023-11-02",
        },
        {
            id: nanoid(),
            name: "coffee",
            description: "Coffee with client.",
            amount: 9,
            priority: "low",
            category: "food",
            date: "2023-11-03",
        },
        {
            id: nanoid(),
            name: "parking",
            description: "Downtown parking fee.",
            amount: 12,
            priority: "low",
            category: "transport",
            date: "2023-11-04",
        },
        {
            id: nanoid(),
            name: "subscription",
            description: "Monthly SaaS subscription.",
            amount: 25,
            priority: "medium",
            category: "services",
            date: "2023-11-05",
        },
        {
            id: nanoid(),
            name: "gift",
            description: "Birthday gift.",
            amount: 60,
            priority: "medium",
            category: "shopping",
            date: "2023-11-06",
        },
        {
            id: nanoid(),
            name: "repair",
            description: "Phone screen repair.",
            amount: 110,
            priority: "high",
            category: "maintenance",
            date: "2023-11-07",
        },
        {
            id: nanoid(),
            name: "books",
            description: "Purchased study materials.",
            amount: 42,
            priority: "low",
            category: "education",
            date: "2023-11-08",
        },
        {
            id: nanoid(),
            name: "laundry",
            description: "Dry cleaning service.",
            amount: 22,
            priority: "low",
            category: "services",
            date: "2023-11-09",
        },
        {
            id: nanoid(),
            name: "taxi",
            description: "Ride to airport.",
            amount: 35,
            priority: "medium",
            category: "transport",
            date: "2023-11-13",
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
                };
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
