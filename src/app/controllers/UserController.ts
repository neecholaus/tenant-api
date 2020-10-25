import {Request, Response} from 'express';
import Validate from '../drivers/Validate';
import * as http from '../resources/http';
import User from '../models/User';
import Auth from '../drivers/Auth';

export default class UserController {
	/**
	 * Creates new user and returns jwt token for sign in.
	 * @param req
	 * @param res
	 */
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
				.status(422)
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

	/**
	 * Compare credentials, return jwt token if they are a match.
	 * @param req
	 * @param res
	 */
	static async signIn(req: Request, res: Response) {
		// ensure email and password were passed
		const missingInputErrors = Validate.require(['email', 'password'], req.body);

		// return any errors
		if (missingInputErrors.length) {
			res
				.status(422)
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

		// pull email from jwt token
		const tokenEmail: string = req.app.get('authPayload').email;

		// pull email, for authorization check as well as update search
		const {email} = req.body;

		// ensure user updating is user being updated
		if (tokenEmail !== email) {
			res
				.status(403)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Unauthorized',
						detail: 'You are not signed in as the user being updated.',
						httpStatus: 403
					}]
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
		let updatedValues: { [inputName:string]: [string] } = {};

		// move value from request body to sanitized mapping
		for (let index in updatedKeys) {
			let inputName: string = updatedKeys[index];

			updatedValues[inputName] = req.body[inputName];
		}

		await User.updateOne({email}, updatedValues);

		res
			.status(200)
			.send(<http.Response> {
				success: true,
				data: {updatedValues}
			});
	}

	// begin password reset flow
	static async inquirePasswordReset(req: Request, res: Response) {
		const token = Auth.randomString(20);

		// check if email was provided
		const missingEmailError = Validate.require(['email'], req.body);

		// return error if email was not provided
		if (missingEmailError.length) {
			res
				.status(422)
				.send(<http.Response> {
					success: false,
					errors: missingEmailError
				});

			return;
		}

		const {email} = req.body;

		// pull user from db
		const user = await User.findOne({email});

		// ensure user was found
		if (!user) {
			res
				.status(404)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Not Found',
						detail: 'User does not exist with that email.',
						httpStatus: 404
					}]
				});

			return;
		}

		// 10 seconds in future
		const tokenExpiresAt = Math.floor(Date.now() / 1000) + 30;

		// perform update
		await user.update({
			passwordResetToken: token,
			passwordResetTokenExp: tokenExpiresAt
		});

		// return token and email to client even if email does not exist
		res.send(<http.Response> {
			success: true,
			data: {token, email, tokenExpiresAt}
		});
	}

	// verify token, update user's password
	static async updatePassword(req: Request, res: Response) {
		const {passwordResetToken, password} = req.body;

		// find user by token
		const user = await User.findOne({passwordResetToken});

		// ensure token is real and assigned to user
		if (!user) {
			res
				.status(400)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Bad Token',
						detail: 'The token provided does not match any users.',
						httpStatus: 400
					}]
				});

			return;
		}

		const currentUnix = Math.floor(Date.now() / 1000);

		// compare now vs token expiration
		if (currentUnix > user.get('passwordResetTokenExp')) {
			res
				.status(410)
				.send(<http.Response> {
					success: false,
					errors: [<http.ResponseError> {
						title: 'Expired',
						detail: 'Password reset link has expired.'
					}]
				});

			return;
		}

		// update user with new password
		await user.update({
			password: Auth.hashString(password),
			passwordResetToken: null,
			passwordResetTokenExp: null,
		});

		res.send(<http.Response> {success: true});
	}

	/**
	 * Returns data included in the JWT payload assuming request passes
	 * authentication middleware.
	 *
	 * @param req
	 * @param res
	 */
	static whoami(req: Request, res: Response) {
		res.send(<http.Response> {
			success: true,
			data: {
				payload: req.app.get('authPayload')
			}
		});
	}
}
