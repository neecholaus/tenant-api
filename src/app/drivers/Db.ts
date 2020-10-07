import * as mongoose from 'mongoose';

class Db {
	static async connect(env: {MONGO_USER, MONGO_PASS, MONGO_SERVER}) {
		const {MONGO_USER, MONGO_PASS, MONGO_SERVER} = env;

		const connectionUrl = `mongodb+srv://s${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}`;

		try {
			await mongoose.connect(connectionUrl, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} catch (err) {
			throw new Error('Class [Db] could not establish a connection to MongoDB.');
		}

		return mongoose.connection;
	}
}

export default Db;
