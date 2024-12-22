import { model, Schema, Model } from 'mongoose';

import { IUserDocument } from '@interfaces/user.interface';

const userSchema: Schema = new Schema({
  googleEmail: { type: String, unique: true, required: true },
  googleName: { type: String, required: true },
  googlePicture: { type: String, required: true },
});

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  'User',
  userSchema,
  'User',
);
export default UserModel;
