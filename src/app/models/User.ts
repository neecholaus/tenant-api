import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	email: String,
	firstName: String,
	lastName: String,
	password: String,
	createdAt: Date,
	updatedAt: Date
});

export default mongoose.model('User', UserSchema);