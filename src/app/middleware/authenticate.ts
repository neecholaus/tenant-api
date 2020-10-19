import * as http from '../resources/http';
import Auth from '../drivers/Auth';
import {Request, Response, NextFunction} from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		const authHeader: string = req.headers.authorization ?? null;

		if (!authHeader) {
			throw new Error('No token was provided.');
		}

		const bearerToken: string = req.headers.authorization.split(' ')[1];

		// attempt to decode token
		let decoded: string|object = Auth.decodeToken(bearerToken);

		// attach decoded payload to session
		req.app.set('authPayload', decoded);
	} catch (err) {
		res
			.status(403)
			.send(<http.Response>{
				success: false,
				errors: [<http.ResponseError>{
					title: 'Forbidden',
					detail: err.message ?? null,
					httpStatus: 403
				}]
			});

		return;
	}

	next();
}
