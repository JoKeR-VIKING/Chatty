import express, { Router } from 'express';

import UserController from '@controllers/user.controller';
import { isAuthenticated } from '@middlewares/auth.middleware';

export default () => {
  const router: Router = express.Router();

  router.post('/user/login', UserController.prototype.login);

  router.get(
    '/user/get-user-status',
    isAuthenticated,
    UserController.prototype.getUserStatus,
  );
  router.get('/user/logout', isAuthenticated, UserController.prototype.logout);
  router.get(
    '/user/search/:searchPrefix',
    isAuthenticated,
    UserController.prototype.searchUser,
  );
  router.get(
    '/user/get-user-details-id/:id',
    isAuthenticated,
    UserController.prototype.getUserDetailsById,
  );

  return router;
};
