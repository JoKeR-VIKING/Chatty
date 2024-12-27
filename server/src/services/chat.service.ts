import { ObjectId } from 'mongodb';

import ChatModel from '@mongo/chat.schema';
import ConversationModel from '@mongo/conversation.schema';
import { IChatDocument } from '@interfaces/chat.interface';
import { IConversationDocument } from '@interfaces/conversation.interface';

class ChatService {
  public async createMessage(chat: IChatDocument) {
    const conversation: IConversationDocument =
      await ConversationModel.findOneAndUpdate(
        {
          $or: [
            {
              messageFrom: chat.messageFrom,
              messageTo: chat.messageTo,
            },
            {
              messageFrom: chat.messageTo,
              messageTo: chat.messageFrom,
            },
          ],
        },
        {
          $setOnInsert: {
            messageFrom: chat.messageFrom,
            messageTo: chat.messageTo,
          },
        },
        { new: true, upsert: true },
      );

    Object.assign(chat, { conversationId: conversation._id });
    return await ChatModel.create(chat);
  }

  public async getChatList(id: string | ObjectId) {
    return await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { messageFrom: new ObjectId(id) },
            { messageTo: new ObjectId(id) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          result: { $first: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: '$result._id',
          messageFrom: '$result.messageFrom',
          messageTo: '$result.messageTo',
          message: '$result.message',
          attachmentName: '$result.attachmentName',
          attachmentData: '$result.attachmentData',
          createdAt: '$result.createdAt',
          isRead: '$result.isRead',
          isEdited: '$result.isEdited',
          isDeleted: '$result.isDeleted',
        },
      },
      { $sort: { createdAt: -1 } },
    ]).exec();
  }
}

const chatService = new ChatService();
export default chatService;
