import * as request from 'supertest';
import {Response} from 'supertest';
import app from '../../src/app';

describe("test auth router", () => {
	test('whoami with no token should return 403', () => {
		return request(app)
			.get('/auth/whoami')
			.then((res: Response) => {
				expect(res.status).toBe(403);
			});
	});

	test("create user with no body should return 422", () => {
		return request(app)
			.post('/auth/create')
			.then((res: Response) => {
				expect(res.status).toBe(422);
			});
	})

	test("create user with body should return 200 with success and token", () => {
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
});