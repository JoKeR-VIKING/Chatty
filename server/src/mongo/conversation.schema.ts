import { ObjectId } from 'mongodb';
import { model, Schema, Model } from 'mongoose';

import { IConversationDocument } from '@interfaces/conversation.interface';

const conversationSchema: Schema = new Schema({
  messageFrom: { type: ObjectId, required: true, ref: 'User' },
  messageTo: { type: ObjectId, required: true, ref: 'User' },
});

const ConversationModel: Model<IConversationDocument> =
  model<IConversationDocument>(
    'Conversation',
    conversationSchema,
    'Conversation',
  );
export default ConversationModel;
