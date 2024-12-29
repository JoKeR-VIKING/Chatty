import express, { Application } from 'express';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'express-async-errors';

import connect from '@mongo/connect';
import routes from '@routes/index';
import Config from '@utils/config';
import { ObjectId, ServerApiVersion } from 'mongodb';

declare module 'express-session' {
  interface SessionData {
    userId?: string | ObjectId;
    user?: {
      _id: string | ObjectId;
      googleEmail: string;
      googleName: string;
      googlePicture: string;
    };
  }
}

class App {
  public app: Application;

  constructor() {
    Config.validateConfig();
    this.app = express();
  }

  public applyMiddleware = () => {
    this.app.use(
      session({
        secret: Config.CLIENT_SECRET!,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: mongoStore.create({
          mongoUrl: Config.MONGO_URI!,
          mongoOptions: {
            tls: true,
            tlsCertificateKeyFile: Config.MONGO_CERT_PATH,
            serverApi: ServerApiVersion.v1,
          },
          collectionName: 'sessions',
          ttl: 1000 * 60 * 60 * 24 * 7,
          autoRemove: 'native',
        }),
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: 'lax',
        },
      }),
    );
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: Config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      }),
    );
  };

  public applicationRoutes = () => {
    routes(this.app);
  };

  public connectDatabase = () => {
    connect();
  };

  public startServer = () => {
    this.app.listen(Config.PORT, () => {
      console.log(`Server is running on port ${Config.PORT}`);
    });
  };

  public start = () => {
    this.applyMiddleware();
    this.applicationRoutes();
    this.connectDatabase();
    this.startServer();
  };
}

const app: App = new App();
app.start();
