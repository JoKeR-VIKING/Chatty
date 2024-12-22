import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  googleEmail: string;
  googleName: string;
  googlePicture: string;
}

export interface IGoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  hd: string;
}
