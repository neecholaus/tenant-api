import * as mongoose from 'mongoose';
import {NextFunction} from 'express';

const UserSchema = new mongoose.Schema({
	email: String,
	phone: String,
	firstName: String,
	lastName: String,
	password: String,
	createdAt: Date,
	updatedAt: Date
}).pre<IUser>("update", function (next: NextFunction) {
	this.updatedAt = new Date();
	next();
}).pre<IUser>("save", function (next: NextFunction) {
	if (!this.createdAt) {
		this.createdAt = new Date();
	}

	this.updatedAt = new Date();

	next();
});

interface IUser extends mongoose.Document {
	email: string;
	phone: string;
	password: string;
	firstName: string;
	lastName: string;
	createdAt: Date;
	updatedAt: Date;
}

export default mongoose.model('User', UserSchema);