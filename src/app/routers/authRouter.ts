import express, {Request, Response} from 'express';

// response types
import * as http from '../resources/http';

// middleware
import {authenticate} from '../middleware/authenticate';

// controllers
import UserController from '../controllers/UserController';

const router = express.Router();

// creates new user
router.post('/create-account', async function (req: Request, res: Response) {
	return UserController.createAccount(req, res);
});

// sign in
router.post('/', async function (req: Request, res: Response) {
	return UserController.signIn(req, res);
});

// test authed endpoint
router.get('/', authenticate, function (req: Request, res: Response) {
	res.send(<http.Response> {
		success: true,
		data: {
			payload: req.app.get('authPayload')
		}
	});
});

export default router;
