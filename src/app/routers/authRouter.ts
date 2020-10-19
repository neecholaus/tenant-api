import {Router, Request, Response} from 'express';

// middleware
import {authenticate} from '../middleware/authenticate';

// controllers
import UserController from '../controllers/UserController';

const router = Router();

// store
router.post('/create', async function (req: Request, res: Response) {
	return UserController.store(req, res);
});

// sign in
router.post('/', async function (req: Request, res: Response) {
	return UserController.signIn(req, res);
});

// update
router.put('/update', authenticate, function (req: Request, res: Response) {
	return UserController.update(req, res);
});

// reset password
router.get('/reset-password', function (req: Request, res: Response) {
	return UserController.inquirePasswordReset(req, res);
});

// submit new password
router.put('/reset-password', function (req: Request, res: Response) {
	return UserController.updatePassword(req, res);
});

// test authed endpoint
router.get('/whoami', authenticate, function (req: Request, res: Response) {
	return UserController.whoami(req, res);
});

export default router;
