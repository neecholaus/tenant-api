import * as jwt from 'jsonwebtoken';

// export function handle(req, res, next) {
// 	if (req.headers.authorization) {
// 		let bearerToken = req.headers.authorization.split(' ')[1];
//
// 		try {
// 			let decoded = jwt.verify(bearerToken, 'shhhssdd');
// 			console.log('authorized', decoded);
// 		} catch (err) {
// 			console.log('invalid token');
// 		}
// 	} else {
// 		let token = jwt.sign({foo: 'bar'}, 'shhhssdd');
// 		console.log('not authorized', token);
// 	}
//
// 	next();
// }