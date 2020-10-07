import * as mongoose from 'mongoose';

class Db {
	static connect(env: {MONGO_USER, MONGO_PASS, MONGO_SERVER}) {
		const {MONGO_USER, MONGO_PASS, MONGO_SERVER} = env;

		const connectionUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}`;

		mongoose.connect(connectionUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		return mongoose;
	}
}

export default Db;
