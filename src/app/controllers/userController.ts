import {Request, Response} from 'express';
import Validate from '../drivers/Validate';
import * as http from '../resources/http';
import User from '../models/User';
import Auth from '../drivers/Auth';

export default class userController {
	// handle request for jwt token
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
}