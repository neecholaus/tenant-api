import * as http from '../resources/http';
import Auth from '../drivers/Auth';

export function authenticate(req, res, next) {
	try {
		const authHeader: string|null = req.headers.authorization ?? null;

		if (!authHeader) {
			throw new Error('No token was provided.');
		}

		const bearerToken: string = req.headers.authorization.split(' ')[1];

		// attempt to decode token
		let decoded: object = Auth.decodeToken(bearerToken);

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
