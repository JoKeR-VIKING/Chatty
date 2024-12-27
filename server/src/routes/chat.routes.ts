import express, { Router } from 'express';

import ChatController from '@controllers/chat.controller';
import { isAuthenticated } from '@middlewares/auth.middleware';

export default () => {
  const router: Router = express.Router();

  router.post(
    '/chat/create/message',
    isAuthenticated,
    ChatController.prototype.createMessage,
  );
  router.post(
    '/chat/create/message-attachment',
    isAuthenticated,
    ChatController.prototype.createMessageWithAttachment,
  );

  router.get(
    '/chat/recent-chats/:messageFrom',
    isAuthenticated,
    ChatController.prototype.getRecentChatList,
  );

  return router;
};
