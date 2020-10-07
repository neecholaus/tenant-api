import * as mongoose from 'mongoose';

class Db {
	static connect(env: {MONGO_USER, MONGO_PASS, MONGO_SERVER}) {
		const connectionUrl = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_SERVER}`;

		mongoose.connect(connectionUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		return mongoose;
	}
}

export default Db;
