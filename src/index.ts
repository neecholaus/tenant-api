import express from 'express';
const app = express();

// framework interfaces
// import * as http from './app/resources/http';

// middleware
// import {Authenticate} from './app/middleware/authenticate';

// routers
import {authRouter} from './app/modules/auth';

// temp demo of auth
// app.use(Authenticate.handle);

// auth module
app.use('/auth', authRouter)

app.listen(9000);