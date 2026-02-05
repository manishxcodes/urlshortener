import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from 'utils/ErrorHanlder.js';
import  userRouter  from './route/user.route.js';
import otpRouter from './route/otp.route.js'
import cookieParser from 'cookie-parser';
import urlRouter from './route/url.route.js';
import cors from 'cors';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-verification-token'],
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use(urlRouter);
app.use('/api/v1/otp', otpRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})