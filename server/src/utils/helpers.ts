import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const convertImageUrltoBase64 = async (url: string): Promise<string> => {
  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: httpsAgent });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  const contentType = response.headers['content-type'];

  return `data:${contentType};base64,${base64}`;
};
