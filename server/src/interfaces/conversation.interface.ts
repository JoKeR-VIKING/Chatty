import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IConversationDocument extends Document {
  _id: string | ObjectId;
  messageFrom: string | ObjectId;
  messageTo: string | ObjectId;
}
