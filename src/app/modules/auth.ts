import express from 'express';

import * as http from '../resources/http';
import * as Auth from '../drivers/Auth';
import {authenticate} from '../middleware/authenticate';

const router = express.Router();

router.post('/', function (req, res) {
	// assuming credentials match

	// temp payload
	const token = Auth.generateToken({
		firstName: 'fred',
		email: 'test@gmail.com'
	});

	res.send(<http.Response> {
		success: true,
		data: {token}
	});
});

// auth middleware for remaining routes - not ideal, will change
router.use(authenticate);

router.get('/', function (req, res) {
	res.send('authenticated');
});

export {router as authRouter};