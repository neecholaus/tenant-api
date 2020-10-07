import express from 'express';

import * as http from '../resources/http';
import * as Auth from '../drivers/Auth';

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


export {router as authRouter};