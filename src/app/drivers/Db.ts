import mongoose from 'mongoose';

class Db {
	static async connect(env: {MONGO_USER: string, MONGO_PASS: string, MONGO_SERVER: string}) {
		const {MONGO_USER, MONGO_PASS, MONGO_SERVER} = env;

		const connectionUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}`;

		try {
			await mongoose.connect(connectionUrl, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} catch (err) {
			console.log(err);
			throw new Error('Class [Db] could not establish a connection to MongoDB.');
		}

		return mongoose.connection;
	}
}

export default Db;
