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
    const createdChat = await ChatModel.create(chat);

    return await ChatModel.findById(createdChat._id)
      .populate('replyMessageId')
      .exec();
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
        $addFields: {
          toUser: {
            $cond: {
              if: { $ne: ['$result.messageFrom', new ObjectId(id)] },
              then: '$result.messageFrom',
              else: '$result.messageTo',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'toUser',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $project: {
          _id: '$result._id',
          conversationId: '$result.conversationId',
          messageFrom: '$result.messageFrom',
          messageTo: '$result.messageTo',
          message: '$result.message',
          attachmentName: '$result.attachmentName',
          attachmentData: '$result.attachmentData',
          createdAt: '$result.createdAt',
          isRead: '$result.isRead',
          isEdited: '$result.isEdited',
          isDeleted: '$result.isDeleted',
          userDetails: { $arrayElemAt: ['$userDetails', 0] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]).exec();
  }

  public async getChats(
    conversationId: string | ObjectId,
    currentUserId: string,
  ) {
    const query = { conversationId: conversationId };

    await ChatModel.updateMany(
      {
        conversationId: conversationId,
        messageTo: currentUserId,
      },
      { $set: { isRead: true } },
    );

    const chats = await ChatModel.find(query)
      .sort({ createdAt: -1 })
      .populate('replyMessageId')
      .exec();

    return chats.reverse();
  }

  public async searchChats(conversationId: string, searchPrefix: string) {
    const query = {
      $and: [
        { conversationId: new ObjectId(conversationId) },
        { message: { $regex: searchPrefix, $options: 'i' } },
      ],
    };

    return await ChatModel.find(query).exec();
  }

  public async getConversationId(
    messageFrom: string | ObjectId,
    messageTo: string | ObjectId,
  ) {
    const query = {
      $or: [
        {
          messageFrom: messageFrom,
          messageTo: messageTo,
        },
        {
          messageFrom: messageTo,
          messageTo: messageFrom,
        },
      ],
    };

    return await ConversationModel.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          messageFrom: messageFrom,
          messageTo: messageTo,
        },
      },
      { new: true, upsert: true },
    ).exec();
  }

  public async addReaction(chatId: string | ObjectId, reaction: string) {
    const query = { _id: new ObjectId(chatId) };

    return (await ChatModel.findOneAndUpdate(
      query,
      { $set: { reaction: reaction } },
      { new: true },
    ).exec()) as IChatDocument;
  }

  public async markChatAsRead(chatId: string | ObjectId) {
    const query = { _id: new ObjectId(chatId) };

    return (await ChatModel.findByIdAndUpdate(
      query,
      { $set: { isRead: true } },
      { new: true },
    ).exec()) as IChatDocument;
  }
}

const chatService = new ChatService();
export default chatService;
