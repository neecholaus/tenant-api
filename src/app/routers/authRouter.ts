import express, {Request, Response} from 'express';

// middleware
import {authenticate} from '../middleware/authenticate';

// controllers
import UserController from '../controllers/UserController';

const router = express.Router();

// store
router.post('/create', async function (req: Request, res: Response) {
	return UserController.store(req, res);
});

// sign in
router.post('/', async function (req: Request, res: Response) {
	return UserController.signIn(req, res);
});

// update
router.put('/update', function (req: Request, res: Response) {
	return UserController.update(req, res);
});

// test authed endpoint
router.get('/whoami', authenticate, function (req: Request, res: Response) {
	return UserController.whoami(req, res);
});

export default router;
