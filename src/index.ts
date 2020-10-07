import express from 'express';
const app = express();

// support env variables
import dotenv from 'dotenv';
dotenv.config()

// routers
import authRouter from './app/routers/authRouter';

// support json request bodies
app.use(express.json());

// auth module
app.use('/auth', authRouter)

app.listen(9000);
