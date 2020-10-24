import * as express from 'express';
const app = express();

// support env variables
import * as dotenv from 'dotenv';
dotenv.config()

// middleware
import {checkDbConnection} from './app/middleware/checkDbConnection';

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
app.use('/auth', checkDbConnection, authRouter);

export default app;