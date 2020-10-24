import * as request from 'supertest';
import {Response} from 'supertest';
import app from './app';

describe("Test the root path", () => {
	test("It should response the GET method", () => {
		return request(app)
			.get('/')
			.then((res: Response) => {
				console.log(res);
				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
			});
	});
});
