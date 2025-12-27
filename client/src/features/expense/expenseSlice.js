import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseAPI } from '../../services/api';

const initialState = {
    expenses: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchExpenses = createAsyncThunk('expense/fetchExpenses', async (_, { rejectWithValue }) => {
    try {
        const data = await expenseAPI.getExpenses();
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const addExpense = createAsyncThunk('expense/addExpense', async (expense, { rejectWithValue }) => {
    try {
        const data = await expenseAPI.addExpense(expense);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const updateExpense = createAsyncThunk('expense/updateExpense', async ({ id, ...expense }, { rejectWithValue }) => {
    try {
        const data = await expenseAPI.updateExpense(id, expense);
        return data;
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
                state.expenses = action.payload;
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
                state.expenses.push(action.payload);
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
                state.expenses = state.expenses.map(expense => expense._id === action.payload._id ? action.payload : expense);
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
                state.expenses = state.expenses.filter(expense => expense._id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default expenseSlice.reducer;
