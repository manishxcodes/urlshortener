import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from 'utils/ErrorHanlder.ts';
import  userRouter  from './route/user.route.ts';
import cookieParser from 'cookie-parser';
import urlRouter from './route/url.route.ts'

const app = express();
dotenv.config
const PORT  = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use(urlRouter)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("listening on port 3000");
})