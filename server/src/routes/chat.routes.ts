import express, { Router } from 'express';

import ChatController from '@controllers/chat.controller';
import { isAuthenticated } from '@middlewares/auth.middleware';
import upload from '@utils/multer.config';

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
    upload.single('attachmentData'),
    ChatController.prototype.createMessageWithAttachment,
  );
  router.post(
    '/chat/create/reaction',
    isAuthenticated,
    ChatController.prototype.addReaction,
  );

  router.get(
    '/chat/recent-chats/:messageFrom',
    isAuthenticated,
    ChatController.prototype.getRecentChatList,
  );
  router.get(
    '/chat/conversation/:conversationId',
    isAuthenticated,
    ChatController.prototype.getChats,
  );
  router.get(
    '/chat/search-chat-message/:conversationId/:searchChatPrefix',
    isAuthenticated,
    ChatController.prototype.searchChats,
  );
  router.get(
    '/chat/get-conversation/:messageFrom/:messageTo',
    isAuthenticated,
    ChatController.prototype.getConversationId,
  );

  return router;
};
