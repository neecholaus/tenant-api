import * as request from 'supertest';
import {Response} from 'supertest';
import app from '../../src/app';

let jwtTokenAfterSignIn: string;

describe("test auth router", () => {
	test("create user with no body should return 422", () => {
		return request(app)
			.post('/auth/create')
			.then((res: Response) => {
				expect(res.status).toBe(422);
			});
	})

	test("create user with body should return 200 with success and data.token", () => {
		// TODO - replace hard coded body with generated values
		return request(app)
			.post('/auth/create')
			.send({
				email: 'test@test.com',
				password: 'testing',
				firstName: 'Test',
				lastName: 'Testman'
			})
			.then((res: Response) => {
				expect(res.status).toBe(200);
				expect(res.body).toEqual(expect.objectContaining({
					success: true,
					data: {
						token: expect.anything()
					}
				}));
			});
	});

	test("create user after email already used should return 409", () => {
		return request(app)
			.post('/auth/create')
			.send({
				email: 'test@test.com',
				password: 'testing',
				firstName: 'Test',
				lastName: 'Testman'
			})
			.then((res: Response) => {
				expect(res.status).toBe(409);
			});
	});

	test("sign in without body should return 422", () => {
		return request(app)
			.post('/auth')
			.then((res: Response) => {
				expect(res.status).toBe(422);
			});
	});

	test("sign in with body but bad email should return 400", () => {
		return request(app)
			.post('/auth')
			.send({
				email: 'bad@email.com',
				password: 'dummy'
			})
			.then((res: Response) => {
				expect(res.status).toBe(400);
			});
	});

	test("sign in with body but bad password should return 400", () => {
		return request(app)
			.post('/auth')
			.send({
				email: 'test@test.com',
				password: 'dummy'
			})
			.then((res: Response) => {
				expect(res.status).toBe(400);
			});
	});

	test("sign in with valid credentials should return 200 with success and data.token", () => {
		return request(app)
			.post('/auth')
			.send({
				email: 'test@test.com',
				password: 'testing'
			})
			.then((res: Response) => {
				expect(res.status).toBe(200);
				expect(res.body).toEqual(expect.objectContaining({
					success: true,
					data: {
						token: expect.anything()
					}
				}))

				// we have token, assign to global variable so we can use it for more tests
				jwtTokenAfterSignIn = res.body.data.token;
			});
	})

	test('whoami with no token should return 403', () => {
		return request(app)
			.get('/auth/whoami')
			.then((res: Response) => {
				expect(res.status).toBe(403);
			});
	});

	test('whoami with token should return 200 with success and data.payload', () => {
		return request(app)
			.get('/auth/whoami')
			.set('Authorization', `Bearer: ${jwtTokenAfterSignIn}`)
			.then((res: Response) => {
				expect(res.status).toBe(200);
				expect(res.body).toEqual(expect.objectContaining({
					success: true,
					data: {
						payload: expect.objectContaining({})
					}
				}));
			});
	});

	test('update user without token', () => {
		return request(app)
			.put('/auth/update')
			.then((res: Response) => {
				expect(res.status).toBe(403);
			});
	});

	test('update user with token but without body', () => {
		return request(app)
			.put('/auth/update')
			.set('Authorization', `Bearer: ${jwtTokenAfterSignIn}`)
			.then((res: Response) => {
				expect(res.status).toBe(422);
			});
	});

	test('update user with body.email not the same as in token payload', () => {
		return request(app)
			.put('/auth/update')
			.set('Authorization', `Bearer: ${jwtTokenAfterSignIn}`)
			.send({email: 'dummy@test.com'})
			.then((res: Response) => {
				expect(res.status).toBe(403)
			});
	});

	test('update user with valid token and body', () => {
		return request(app)
			.put('/auth/update')
			.set('Authorization', `Bearer: ${jwtTokenAfterSignIn}`)
			.send({
				email: 'test@test.com',
				firstName: 'Test Update Name'
			})
			.then((res: Response) => {
				expect(res.status).toBe(200);
				expect(res.body).toEqual(expect.objectContaining({
					success: true,
					data: {
						updatedValues: expect.anything()
					}
				}));
			});
	});
});