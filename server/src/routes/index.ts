import { Application } from 'express';

import userRoutes from '@routes/user.routes';
import chatRoutes from '@routes/chat.routes';

const BASE_PATH = '/v1';

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, userRoutes());
    app.use(BASE_PATH, chatRoutes());
  };

  routes();
};
