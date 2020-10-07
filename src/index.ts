import express, {Request, Response, NextFunction} from 'express';
const app = express();

// support env variables
import dotenv from 'dotenv';
dotenv.config()

// routers
import authRouter from './app/routers/authRouter';

// support json request bodies
app.use(express.json());

// application wide value bag
let bag = {
	env: process.env
};

// assign value bag to express instance
app.set('bag', bag);

// auth module
app.use('/auth', authRouter);

app.listen(9000);
