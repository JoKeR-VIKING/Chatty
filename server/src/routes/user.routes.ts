import express, { Router } from 'express';

import UserController from '@controllers/user.controller';
import { isAuthenticated } from '@middlewares/auth.middleware';

export default () => {
  const router: Router = express.Router();

  router.post('/login', UserController.prototype.login);
  router.get(
    '/get-user-status',
    isAuthenticated,
    UserController.prototype.getUserStatus,
  );

  return router;
};
