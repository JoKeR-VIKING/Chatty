import mongoose from 'mongoose';

import Config from '@utils/config';

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
      .connect(Config.MONGO_URI!, {
        tls: true,
        tlsCertificateKeyFile: 'chatty-cert.pem',
        serverApi: mongoose.mongo.ServerApiVersion.v1,
      })
      .then(() => console.log('Successfully connected to database'))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  };

  connect();
  mongoose.connection.on('disconnected', connect);
};
