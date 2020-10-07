import express from 'express';

const router = express.Router();

router.get('/test', function (req, res) {
	console.log('getting test');

	res.status(200).send('all good :)');
});


export {router as authRouter};