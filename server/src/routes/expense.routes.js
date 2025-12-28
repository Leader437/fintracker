import { Router } from "express";
import {
    createExpense,
    createExpensesBulk,
    getExpense,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/add-expense').post(verifyJWT, createExpense);
router.route('/add-expenses-bulk').post(verifyJWT, createExpensesBulk);
router.route('/get-expense').get(verifyJWT, getExpense);
router.route('/update-expense/:id').put(verifyJWT, updateExpense);
router.route('/delete-expense/:id').delete(verifyJWT, deleteExpense);

export default router;