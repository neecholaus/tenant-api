import express from 'express';

import * as http from './app/resources/http';
import {Authenticate} from './app/middleware/authenticate';

const app = express();

app.use(Authenticate.handle);

app.get('/', (req, res) => {
	res.status(400).send(<http.Response> {
		success: false,
		errors: [<http.ResponseError> {
			title: "Bad Request",
			httpStatus: 400
		}]
	});
});

app.listen(9000);