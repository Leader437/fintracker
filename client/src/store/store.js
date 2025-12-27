import { configureStore } from "@reduxjs/toolkit";

import expenseReducer from "../features/expense/expenseSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        expense: expenseReducer,
        auth: authReducer,
    }
});