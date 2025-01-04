import express, { Application } from 'express';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ObjectId, ServerApiVersion } from 'mongodb';
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';

import connect from '@mongo/connect';
import routes from '@routes/index';
import Config from '@utils/config';

import ChatSocketHandler from '@sockets/chat.socket';

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
    this.app.set('trust proxy', true);
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
          secure: Config.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 3,
          sameSite: 'none',
        },
      }),
    );
    this.app.use(cookieParser());
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
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

  public setupSocketIo = (server: HttpServer) => {
    const io = new Server(server, {
      cors: {
        origin: Config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });

    const chatSocketHandler = new ChatSocketHandler(io);
    chatSocketHandler.listen();
  };

  public startServer = () => {
    const server: HttpServer = createServer(this.app);
    this.setupSocketIo(server);

    server.listen(Config.PORT, () => {
      console.log(`Server listening on port ${Config.PORT}`);
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
