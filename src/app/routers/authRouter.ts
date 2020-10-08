import express, {Request, Response} from 'express';

// response types
import * as http from '../resources/http';

// drivers
import Auth from '../drivers/Auth';
import Validate from '../drivers/Validate';

// middleware
import {authenticate} from '../middleware/authenticate';

// models
import User from '../models/User';

const router = express.Router();

// TODO - abstract route handling to controllers

// creates new user
router.post('/create-user', async function (req: Request, res: Response) {
	// ensure required fields are present
	const missingInputErrors = Validate.require([
		'email',
		'password',
		'firstName',
		'lastName'
	], req.body);

	// return errors if required field(s) are missing
	if (missingInputErrors.length) {
		res
			.status(400)
			.send(<http.Response> {
				success: false,
				errors: missingInputErrors
			})

		return;
	}

	// pull info from body
	let {email, firstName, lastName, password} = req.body;

	// encrypt pass
	password = Auth.hashString(password);

	// check for existing user by email
	if (await User.exists({email})) {
		res
			.status(409)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'Duplicate Email',
					detail: 'This e-mail has already been used.',
					httpStatus: 409
				}],
			});

		return;
	}

	// create user
	const user = await (new User({email, firstName, lastName, password})).save();

	// build payload for JWT token
	const payload = {
		id: user._id,
		email
	};

	// gen token with user info in payload
	const token = Auth.generateToken(payload);

	// return with token
	res.send(<http.Response> {
		success: true,
		data: {
			token
		}
	});
});

// sign in and get jwt token
router.post('/', async function (req: Request, res: Response) {
	// ensure email and password were passed
	const missingInputErrors = Validate.require(['email', 'password'], req.body);

	// return any errors
	if (missingInputErrors.length) {
		res
			.status(400)
			.send(<http.Response> {
				success: false,
				errors: missingInputErrors
			});

		return;
	}

	const {email, password} = req.body;

	// grab user from db
	const user = await User.findOne({email});

	// return error if user not found
	if (!user) {
		res
			.status(400)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'Invalid E-mail',
					detail: 'E-mail was not tied to any existing user.',
					httpStatus: 400
				}]
			});

		return;
	}

	console.log(user);

	res.send('ok');
	return;

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
	console.log(req.app.get('authPayload'));
	res.send(<http.Response> {
		success: true,
		data: {
			authenticated: true
		}
	});
});

export default router;
