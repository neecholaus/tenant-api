import {Request, Response, NextFunction} from 'express';
import * as http from '../resources/http';
import Db from '../drivers/Db';

export async function checkDbConnection(req: Request, res: Response, next: NextFunction) {
	let connection;

	try {
		connection = await Db.connect(req.app.get('bag').env);
	} catch (err) {
		res
			.status(500)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'DB Connection',
					detail: 'Database connection could not be established.',
					httpStatus: 500
				}]
			});

		return;
	}

	// attach to request
	req.app.set('db', connection);

	next();
}