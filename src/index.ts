import express, {Request, Response, NextFunction} from 'express';
const app = express();

// support env variables
import dotenv from 'dotenv';
dotenv.config()

// routers
import authRouter from './app/routers/authRouter';

// support json request bodies
app.use(express.json());

const includeState = (req: Request, res: Response, next: NextFunction) => {
	req.app.set('bag', {
		testVal: 'testing'
	});

	next();
}

// auth module
app.use('/auth', includeState, authRouter)

app.listen(9000);
