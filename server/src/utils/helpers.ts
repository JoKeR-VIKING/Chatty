import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const convertUrlToBase64 = async (url: string): Promise<string> => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    httpsAgent: httpsAgent,
  });

  const contentType = response.headers['content-type'];
  const base64Data = Buffer.from(response?.data, 'binary').toString('base64');

  return `data:${contentType};base64,${base64Data}`;
};
