import express, {Request, Response} from 'express';

// response types
import * as http from '../resources/http';

// drivers
import Auth from '../drivers/Auth';

// middleware
import {authenticate} from '../middleware/authenticate';

// models
import User from '../models/User';

const router = express.Router();

// creates new user
router.post('/create-account', async function (req: Request, res: Response) {
	const {email, firstName, lastName, password} = req.body;

	// check for existing user by email
	if (await User.exists({email})) {
		res
			.status(409)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'Email',
					detail: 'This e-mail has already been used.',
					httpStatus: 409
				}],
			});

		return;
	}

	// create user

	// gen token with user info in payload

	// return with token

	res.send('ok');
});


router.post('/', function (req: Request, res: Response) {
	// assuming credentials match
	const tempMatchingCreds = {
		email: 'test@test.com',
		pass: 'temppass'
	};

	const passedCreds = {
		email: req.body.email,
		pass: req.body.pass // will be encrypted
	};

	// passed creds matched
	if (
		passedCreds.email == tempMatchingCreds.email &&
		passedCreds.pass == tempMatchingCreds.pass
	) {
		const token = Auth.generateToken(passedCreds);

		res.send(<http.Response> {
			success: true,
			data: {token}
		});
	} else {
		res
			.status(403)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'Forbidden',
					detail: 'Credentials were invalid.',
					httpStatus: 403
				}]
			});
	}
});


router.get('/', authenticate, function (req: Request, res: Response) {
	res.send(<http.Response> {
		success: true,
		data: {
			authenticated: true
		}
	});
});

export default router;
