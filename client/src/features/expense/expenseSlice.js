import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseAPI } from '../../services/api';

const defaultCategories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Health",
    "Shopping",
    "Education",
    "Services",
    "Rent",
    "Maintenance",
];

const initialState = {
    expenses: [],
    loading: false,
    error: null,
    categories: [...defaultCategories], // will be derived after fetch
};

// Thunks
export const fetchExpenses = createAsyncThunk('expense/fetchExpenses', async (_, { rejectWithValue }) => {
    try {
        const res = await expenseAPI.getExpenses();
        return res.data; // Only return the array of expenses
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const addExpense = createAsyncThunk('expense/addExpense', async (expense, { rejectWithValue }) => {
    try {
        const res = await expenseAPI.addExpense(expense);
        return res?.data ?? res;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const updateExpense = createAsyncThunk('expense/updateExpense', async ({ id, ...expense }, { rejectWithValue }) => {
    try {
        const res = await expenseAPI.updateExpense(id, expense);
        // If backend returns { statusCode, data, message }, extract data
        return res?.data ?? res;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteExpense = createAsyncThunk('expense/deleteExpense', async (id, { rejectWithValue }) => {
    try {
        await expenseAPI.deleteExpense(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                // Map backend fields to frontend expected fields
                state.expenses = Array.isArray(action.payload)
                    ? action.payload.map(exp => ({
                        id: exp._id || exp.id,
                        name: exp.expenseName,
                        category: exp.expenseCategory,
                        description: exp.expenseDescription,
                        date: exp.expenseDate ? (typeof exp.expenseDate === 'string' ? exp.expenseDate.split('T')[0] : exp.expenseDate) : '',
                        amount: exp.expenseAmount,
                        priority: exp.expensePriority,
                        ...exp // keep all original fields for safety
                    }))
                    : [];
                // Derive unique categories from all expenses and merge with defaultCategories
                const allCategories = new Set(defaultCategories);
                state.expenses.forEach(exp => {
                    if (exp.category && typeof exp.category === 'string') {
                        allCategories.add(exp.category);
                    }
                });
                state.categories = Array.from(allCategories);
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Expense
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                                state.loading = false;
                                // Map backend fields to frontend expected fields for single add
                                const exp = action.payload;
                                state.expenses.push({
                                    id: exp._id || exp.id,
                                    name: exp.expenseName,
                                    category: exp.expenseCategory,
                                    description: exp.expenseDescription,
                                    date: exp.expenseDate ? (typeof exp.expenseDate === 'string' ? exp.expenseDate.split('T')[0] : exp.expenseDate) : '',
                                    amount: exp.expenseAmount,
                                    priority: exp.expensePriority,
                                    ...exp
                                });
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                                state.loading = false;
                                // Map backend fields to frontend expected fields for update
                                const exp = action.payload;
                                state.expenses = state.expenses.map(expense =>
                                    (expense.id === (exp._id || exp.id) || expense._id === (exp._id || exp.id))
                                        ? {
                                                id: exp._id || exp.id,
                                                name: exp.expenseName,
                                                category: exp.expenseCategory,
                                                description: exp.expenseDescription,
                                                date: exp.expenseDate ? (typeof exp.expenseDate === 'string' ? exp.expenseDate.split('T')[0] : exp.expenseDate) : '',
                                                amount: exp.expenseAmount,
                                                priority: exp.expensePriority,
                                                ...exp
                                            }
                                        : expense
                                );
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                                state.loading = false;
                                state.expenses = state.expenses.filter(expense =>
                                    expense._id !== action.payload && expense.id !== action.payload
                                );
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default expenseSlice.reducer;

// Selector to get global categories
export const selectGlobalCategories = (state) => state.expense.categories;
