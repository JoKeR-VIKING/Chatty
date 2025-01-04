import { ObjectId } from 'mongodb';
import { model, Schema, Model } from 'mongoose';

import { IChatDocument } from '@interfaces/chat.interface';

const chatSchema: Schema = new Schema(
  {
    conversationId: { type: ObjectId, required: true, ref: 'Conversation' },
    messageFrom: { type: ObjectId, required: true, ref: 'User' },
    messageTo: { type: ObjectId, required: true, ref: 'User' },
    message: { type: String, required: false, default: '' },
    attachmentName: { type: String, required: false, default: '' },
    attachmentData: { type: String, required: false, default: null },
    isRead: { type: Boolean, required: false, default: false },
    isEdited: { type: Boolean, required: false, default: false },
    isDeleted: { type: Boolean, required: false, default: false },
    reaction: { type: String, required: false, default: '' },
    replyMessageId: {
      type: ObjectId,
      required: false,
      default: null,
      ref: 'Chat',
    },
  },
  { timestamps: true },
);

const ChatModel: Model<IChatDocument> = model<IChatDocument>(
  'Chat',
  chatSchema,
  'Chat',
);
export default ChatModel;
