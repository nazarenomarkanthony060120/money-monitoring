import mongoose from 'mongoose';
import { userSchema } from '../schemas/userSchema';
import { IUserDocument, IUserModel } from '../types';

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User; 