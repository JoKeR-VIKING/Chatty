import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import sharp from 'sharp';
import mime from 'mime-types';

import chatService from '@services/chat.service';
import { IChatDocument, IRecentChat } from '@interfaces/chat.interface';
import { IConversationDocument } from '@interfaces/conversation.interface';
import { chatSocketObject } from '@sockets/chat.socket';

class ChatController {
  public async createMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { messageFrom, messageTo, message, replyMessageId } = req.body;

    try {
      const chat = await chatService.createMessage({
        messageFrom: messageFrom,
        messageTo: messageTo,
        message: message,
        replyMessageId: replyMessageId,
      } as IChatDocument);

      chatSocketObject.to(messageFrom).emit('new-message', chat);
      chatSocketObject.to(messageTo).emit('new-message', chat);

      const messageFromRecentChats = await chatService.getChatList(messageFrom);
      const messageToRecentChats = await chatService.getChatList(messageTo);

      chatSocketObject
        .to(messageFrom)
        .emit('recent-message', messageFromRecentChats);
      chatSocketObject
        .to(messageTo)
        .emit('recent-message', messageToRecentChats);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Successfully created chat message', data: chat });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Error creating chat message' });
      next(err);
    }
  }

  public async createMessageWithAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { messageFrom, messageTo, attachmentName, replyMessageId } = req.body;
    const attachmentData = req.file?.buffer;
    let mimeType = mime.lookup(attachmentName) || 'application/octet-stream';

    if (mimeType === 'audio/wave') mimeType = 'audio/wav';

    try {
      let compressedAttachmentData: string = attachmentData?.toString(
        'base64',
      ) as string;

      if (mimeType.startsWith('image/')) {
        compressedAttachmentData = (
          await sharp(attachmentData)
            .resize({ width: 1024 })
            .jpeg({ quality: 80 })
            .toBuffer()
        ).toString('base64');
      }

      const base64Attachment = `data:${mimeType};base64,${compressedAttachmentData}`;

      const chat = await chatService.createMessage({
        messageFrom: messageFrom,
        messageTo: messageTo,
        attachmentName: attachmentName,
        attachmentData: base64Attachment,
        replyMessageId: replyMessageId,
      } as IChatDocument);

      chatSocketObject.to(messageFrom).emit('new-message', chat);
      chatSocketObject.to(messageTo).emit('new-message', chat);

      const messageFromRecentChats = await chatService.getChatList(messageFrom);
      const messageToRecentChats = await chatService.getChatList(messageTo);

      chatSocketObject
        .to(messageFrom)
        .emit('recent-message', messageFromRecentChats);
      chatSocketObject
        .to(messageTo)
        .emit('recent-message', messageToRecentChats);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Successfully created chat message', data: chat });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Error creating chat message with attachment' });
      next(err);
    }
  }

  public async getRecentChatList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { messageFrom } = req.params;

    try {
      const chatList: IRecentChat[] =
        await chatService.getChatList(messageFrom);

      res.status(StatusCodes.OK).json({
        message: 'Successfully fetched recent chat list',
        chatList: chatList,
      });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Error getting chat list' });
      next(err);
    }
  }

  public async getChats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { conversationId } = req.params;

    try {
      const chats = await chatService.getChats(conversationId);

      res.status(StatusCodes.OK).json({
        message: 'Successfully fetched chats',
        chats: chats,
      });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Error getting chats for chat` });
      next(err);
    }
  }

  public async searchChats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { conversationId, searchChatPrefix } = req.params;

    try {
      const chats: IChatDocument[] = await chatService.searchChats(
        conversationId,
        searchChatPrefix,
      );

      res.status(StatusCodes.OK).json({
        message: 'Successfully fetched chats for search prefix',
        chats: chats,
      });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `Error getting chats for search prefix ${searchChatPrefix}`,
      });
      next(err);
    }
  }

  public async getConversationId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { messageFrom, messageTo } = req.params;

    try {
      const conversation: IConversationDocument =
        await chatService.getConversationId(messageFrom, messageTo);

      res.status(StatusCodes.OK).json({
        message: 'Successfully fetched conversation id',
        conversationId: conversation._id,
      });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `Error getting conversation id`,
      });
      next(err);
    }
  }

  public async addReaction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { chatId, reaction } = req.body;

    try {
      const chat: IChatDocument = await chatService.addReaction(
        chatId,
        reaction,
      );

      chatSocketObject
        .to(chat.messageFrom.toString())
        .emit('new-reaction', chat);
      chatSocketObject.to(chat.messageTo.toString()).emit('new-reaction', chat);

      res.status(StatusCodes.OK).json({
        message: 'Successfully added reaction',
      });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Error adding reaction',
      });
      next(err);
    }
  }
}

export default ChatController;
