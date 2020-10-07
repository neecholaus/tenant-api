import * as jwt from 'jsonwebtoken';

// TODO - move secret to env file

// Takes an object, generates and returns a JWT token.
export function generateToken(payload: object): string {
	return jwt.sign(payload, 'secret');
}

export function decodeToken(token: string): object|null {
	try {
		return jwt.verify(token, 'secret');
	} catch (err) {
		throw new Error('Token was provided but was invalid.');
	}
}