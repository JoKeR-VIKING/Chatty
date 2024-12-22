import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public static PORT: number | undefined;
  public static NODE_ENV: string;
  public static MONGO_URI: string | undefined;
  public static MONGO_CERT_PATH: string | undefined;
  public static GOOGLE_CLIENT_ID: string | undefined;
  public static GOOGLE_CLIENT_SECRET: string | undefined;
  public static CLIENT_URL: string | undefined;
  public static CLIENT_SECRET: string | undefined;

  constructor() {
    Config.PORT = process.env.PORT ? parseInt(process.env.PORT) : undefined;
    Config.NODE_ENV = process.env.NODE_ENV || 'development';
    Config.MONGO_URI = process.env.MONGO_URI || undefined;
    Config.MONGO_CERT_PATH = process.env.MONGO_CERT_PATH || undefined;
    Config.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || undefined;
    Config.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || undefined;
    Config.CLIENT_URL = process.env.CLIENT_URL || undefined;
    Config.CLIENT_SECRET = process.env.CLIENT_SECRET || undefined;
  }

  public static validateConfig = () => {
    new Config();
    for (const key of Object.keys(Config)) {
      if (!Config[key as keyof typeof Config]) {
        throw new Error(`Missing ${key} in .env`);
      }
    }
  };
}

export default Config;
