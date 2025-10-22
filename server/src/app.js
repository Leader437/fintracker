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

export default app;