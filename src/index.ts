import express from 'express';
import * as jwt from 'jsonwebtoken';

import * as http from './app/resources/http';

const app = express();

app.use((req, res, next) => {
	if (req.headers.authorization) {
		let bearerToken = req.headers.authorization.split(' ')[1];

		try {
			let decoded = jwt.verify(bearerToken, 'shhhs');
			console.log('authorized', decoded);
		} catch (err) {
			console.log('invalid token');
		}
	} else {
		let token = jwt.sign({foo: 'bar'}, 'shhhssdd');
		console.log('not authorized', token);
	}

	next();
});

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