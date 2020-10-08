import express, {Request, Response} from 'express';

// response types
import * as http from '../resources/http';

// drivers
import Auth from '../drivers/Auth';

// middleware
import {authenticate} from '../middleware/authenticate';

const router = express.Router();

router.post('/', function (req, res) {
	// assuming credentials match
	const tempMatchingCreds = {
		email: 'test@test.com',
		pass: 'temppass'
	};

	const passedCreds = {
		email: req.body.email,
		pass: req.body.pass // will be encrypted
	};

	// passed creds matched
	if (
		passedCreds.email == tempMatchingCreds.email &&
		passedCreds.pass == tempMatchingCreds.pass
	) {
		const token = Auth.generateToken(passedCreds);

		res.send(<http.Response> {
			success: true,
			data: {token}
		});
	} else {
		res
			.status(403)
			.send(<http.Response> {
				success: false,
				errors: [<http.ResponseError> {
					title: 'Forbidden',
					detail: 'Credentials were invalid.',
					httpStatus: 403
				}]
			});
	}
});


router.get('/', authenticate, function (req: Request, res: Response) {
	res.send(<http.Response> {
		success: true,
		data: {
			authenticated: true
		}
	});
});

export default router;
