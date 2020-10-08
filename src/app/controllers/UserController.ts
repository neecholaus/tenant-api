import {Request, Response} from 'express';
import Validate from '../drivers/Validate';
import * as http from '../resources/http';
import User from '../models/User';
import Auth from '../drivers/Auth';

export default class UserController {
	// store user
	static async store(req: Request, res: Response) {
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
		let {email, phone, firstName, lastName, password} = req.body;

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
		const user = await (new User({email, phone, firstName, lastName, password})).save();

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
	}

	// compare credentials, return jwt token
	static async signIn(req: Request, res: Response) {
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

		// return error if password does not match
		if (!Auth.stringMatchesHash(password, user.get('password'))) {
			res
				.status(400)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Invalid Password',
						httpStatus: 400
					}]
				});

			return;
		}

		const token = Auth.generateToken({
			id: user._id,
			email
		});

		res.send(<http.Response> {
			success: true,
			data: {token}
		});
	}

	// update user
	static async update(req: Request, res: Response) {
		// ensure email is provided since this will be our search fielda
		const missingInputErrors: http.ResponseError[] = Validate.require(['email'], req.body);

		if (missingInputErrors.length) {
			res
				.status(400)
				.send(<http.Response> {
					success: false,
					errors: missingInputErrors
				});

			return;
		}

		// only update these fields
		const possibleUpdateFields: string[] = [
			'phone',
			'firstName',
			'lastName'
		];

		// pull values of fields we want to update
		const updatedKeys: string[] = Object.keys(req.body).filter(key => {
			return possibleUpdateFields.indexOf(key) >= 0;
		});

		// object for sanitized mapping of request body
		let updatedValues: object = {};

		// move value from request body to sanitized mapping
		for (let index in updatedKeys) {
			let inputName: string = updatedKeys[index];

			updatedValues[inputName] = req.body[inputName];
		}

		const {email} = req.body;

		let update = await User.updateOne({email}, updatedValues);

		// build either successful or error response
		// return error if no data was different
		if (update.nModified) {
			res
				.status(200)
				.send(<http.Response> {
					success: true,
					data: {updatedValues}
				});
		} else {
			res
				.status(500)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Update Failed',
						detail: 'No data needed to be updated.',
						httpStatus: 500
					}]
				});
		}
	}

	// returns data included in token payload
	static whoami(req: Request, res: Response) {
		res.send(<http.Response> {
			success: true,
			data: {
				payload: req.app.get('authPayload')
			}
		});
	}
}