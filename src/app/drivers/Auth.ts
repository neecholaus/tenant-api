import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto-random-string';

class Auth {

	// Takes an object, generates and returns a JWT token.
	static generateToken(payload: object): string {
		return jwt.sign({
			...payload,
			exp: Math.floor(Date.now() / 1000) + (60 * 60)
		}, process.env.JWT_SECRET);
	}

	// Will attempt to decode and return token, if exception, throw custom error.
	static decodeToken(token: string): object {
		try {
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			throw new Error('Token was provided but was invalid.');
		}
	}

	// returns hashed passed string
	static hashString(password: string): string {
		return bcrypt.hashSync(password, 10);
	}

	// returns whether passed plain text hashes to equivalent of passed hashed string
	static stringMatchesHash(plainTextPass: string, hashedComparison: string): boolean {
		return bcrypt.compareSync(plainTextPass, hashedComparison);
	}

	// returns random string
	static randomString(length: number = 12) {
		return crypto({
			length: length,
			type: 'distinguishable'
		});
	}
}

export default Auth;
