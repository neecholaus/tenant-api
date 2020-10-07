import express from 'express';
const app = express();

// routers
import {authRouter} from './app/routers/authRouter';

// support json request bodies
app.use(express.json());

// auth module
app.use('/auth', authRouter)

app.listen(9000);