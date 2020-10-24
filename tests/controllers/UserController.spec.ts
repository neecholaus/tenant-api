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
});
