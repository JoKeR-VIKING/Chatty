import axios from 'axios';

import Config from '@utils/config.ts';

new Config();
const axiosClient = axios.create({
  baseURL: `${Config.API_URL}/${Config.API_VERSION}`,
  withCredentials: true,
});

export default axiosClient;
