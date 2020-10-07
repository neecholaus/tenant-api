import express from 'express';

import * as http from './app/resources/http';

const app = express();

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