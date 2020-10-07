import express from 'express';

import * as http from '../resources/http';
import * as auth from '../middleware/authenticate';

const router = express.Router();

router.post('/', function (req, res) {
	// assuming credentials match

	// temp payload
	const token = auth.generateToken({
		firstName: 'fred',
		email: 'test@gmail.com'
	});

	res.send(<http.Response> {
		success: true,
		data: {token}
	});
});


export {router as authRouter};