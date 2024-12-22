class Config {
  public static GOOGLE_CLIENT_ID: string | undefined;
  public static GOOGLE_CLIENT_SECRET: string | undefined;
  public static API_URL: string | undefined;
  public static API_VERSION: string;

  constructor() {
    Config.GOOGLE_CLIENT_ID =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || undefined;
    Config.GOOGLE_CLIENT_SECRET =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || undefined;
    Config.API_URL = process.env.NEXT_PUBLIC_API_URL || undefined;
    Config.API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
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
