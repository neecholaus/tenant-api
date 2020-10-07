import * as jwt from 'jsonwebtoken';

// Takes an object, generates and returns a JWT token.
export function generateToken(payload: object): string {
	return jwt.sign(payload, process.env.JWT_SECRET);
}

// Will attempt to decode and return token, if exception, throw custom error.
export function decodeToken(token: string): object {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		throw new Error('Token was provided but was invalid.');
	}
}
