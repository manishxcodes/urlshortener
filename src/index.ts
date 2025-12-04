import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from 'utils/ErrorHanlder';

const app = express();
dotenv.config
const PORT  = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Up and running"})
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("listening on port 3000");
})