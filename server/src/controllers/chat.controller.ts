import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import chatService from '@services/chat.service';
import { IChatDocument } from '@interfaces/chat.interface';

class ChatController {
  public async createMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { messageFrom, messageTo, message } = req.body;

    try {
      const chat = await chatService.createMessage({
        messageFrom: messageFrom,
        messageTo: messageTo,
        message: message,
      } as IChatDocument);

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
    const { messageFrom, messageTo, attachmentName, attachmentData } = req.body;

    try {
      const chat = await chatService.createMessage({
        messageFrom: messageFrom,
        messageTo: messageTo,
        attachmentName: attachmentName,
        attachmentData: attachmentData,
      } as IChatDocument);

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
      const chatList: IChatDocument[] =
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
}

export default ChatController;
