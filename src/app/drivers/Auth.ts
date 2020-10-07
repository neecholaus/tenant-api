import * as jwt from 'jsonwebtoken';

// Takes an object, generates and returns a JWT token.
export function generateToken(payload: object): string {
	// TODO - move secret to env file
	return jwt.sign(payload, 'secret');
}