import express from 'express';
const app = express();

// routers
import {authRouter} from './app/routers/authRouter';

// auth module
app.use('/auth', authRouter)

app.listen(9000);