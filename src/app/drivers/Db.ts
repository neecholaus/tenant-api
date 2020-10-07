import * as mongoose from 'mongoose';

class Db {
	static connect() {
		mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		return mongoose
	}
}

export default Db;
