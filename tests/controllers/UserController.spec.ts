import * as request from 'supertest';
import {Response} from 'supertest';
import app from '../../src/app';

describe("Test UserController", () => {
	test('whoami should return 403', () => {
		return request(app)
			.get('/auth/whoami')
			.then((res: Response) => {
				expect(res.status).toBe(403);
			});
	});

	test("create user should return 200 with success and token", () => {
		return request(app)
			.post('/auth')
			.then((res: Response) => {
				expect(res.status).toBe(200);
				expect(res.body).toEqual(expect.objectContaining({
					success: true,
					token: expect.anything()
				}));
			});
	})
});