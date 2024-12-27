import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IChatDocument extends Document {
  _id: string | ObjectId;
  messageFrom: string | ObjectId;
  messageTo: string | ObjectId;
  message?: string;
  attachmentName?: string;
  attachmentData?: string;
  createdAt?: Date;
  isRead?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}
