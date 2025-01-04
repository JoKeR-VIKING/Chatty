import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

import { IUserDocument } from '@interfaces/user.interface';

export interface IChatDocument extends Document {
  _id: string | ObjectId;
  conversationId: string | ObjectId;
  messageFrom: string | ObjectId;
  messageTo: string | ObjectId;
  message?: string;
  attachmentName?: string;
  attachmentData?: string;
  createdAt?: Date;
  isRead?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  reaction?: string;
  replyMessageId: string | ObjectId;
}

export interface IRecentChat extends IChatDocument {
  userDetails: IUserDocument;
}
