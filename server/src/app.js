import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from './config/index.js';

const app = express();

app.use(cors({
    origin: CORS_ORIGIN
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js"
import expenseRouter from "./routes/expense.routes.js"

// routes middleware                  // using .use to mount the router middleware
app.use('/api/v1/users', userRouter);         // mounting userRouter on /api/users path

// routes middleware
app.use('/api/v1/expenses', expenseRouter);

export default app;