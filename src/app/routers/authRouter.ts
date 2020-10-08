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
router.post('/create-user', async function (req: Request, res: Response) {
	// TODO - abstract to required input validator

	let requiredInputs = ['email', 'password', 'firstName', 'lastName'];
	let missingInputErrors = [];
	for (let input in requiredInputs) {
		// if required field is not populated in request
		if (Object.keys(req.body).indexOf(requiredInputs[input]) == -1) {
			missingInputErrors.push(<http.ResponseError> {
				title: 'Missing Input',
				detail: requiredInputs[input] + ' was not provided.',
				httpStatus: 400
			});

			continue;
		}

		// if value provided but falsy
		if (!req.body[requiredInputs[input]]) {
			missingInputErrors.push(<http.ResponseError> {
				title: 'Invalid Input',
				detail: requiredInputs[input] + ' was invalid.',
				httpStatus: 400
			});
		}
	}

	// return errors
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
	console.log(req.app.get('authPayload'));
	res.send(<http.Response> {
		success: true,
		data: {
			authenticated: true
		}
	});
});

export default router;
