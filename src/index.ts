import express from 'express';
const app = express();

// support env variables
import dotenv from 'dotenv';
dotenv.config()

// routers
import {authRouter} from './app/routers/authRouter';

import mongoose from 'mongoose';

mongoose.connect(`mongodb+srv://${process.env.mongo_user}:${process.env.mongo_pass}@cluster0.a5qys.mongodb.net/test`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// support json request bodies
app.use(express.json());

// auth module
app.use('/auth', authRouter)

app.listen(9000);
