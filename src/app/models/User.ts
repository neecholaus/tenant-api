import * as mongoose from 'mongoose';
import {NextFunction} from 'express';

interface IUser extends mongoose.Document {
	email: string;
	phone: string;
	password: string;
	firstName: string;
	lastName: string;
	passwordResetToken: string;
	passwordResetTokenExp: number;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
	email: String,
	phone: String,
	firstName: String,
	lastName: String,
	password: String,
	passwordResetToken: String,
	passwordResetTokenExp: Number,
	createdAt: Date,
	updatedAt: Date
});

// document middleware
UserSchema.pre<IUser>('save', function (next: NextFunction) {
	if (!this.createdAt) {
		this.createdAt = new Date();
	}

	next();
});

// query middleware
UserSchema.pre<IUser>('updateOne', function (next: NextFunction) {
	this.set({updatedAt: new Date()});

	next();
});

export default mongoose.model('User', UserSchema);