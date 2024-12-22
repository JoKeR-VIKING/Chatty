import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import { ConfigProvider, Layout, theme } from 'antd';

import Config from '@utils/config';
import LogoImage from '@images/Logo.jpg';
import ToastProvider from '@components/ToastProvider';
import store from '@store/index';

import 'animate.css';
import '@styles/index.css';

const { Content } = Layout;
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    Config.validateConfig();
    setConfigLoading(false);
  }, []);

  if (configLoading) return;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={LogoImage.src} />
        <title>Chatty</title>
      </Head>

      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1e90ff',
            colorTextBase: '#000',
          },
          components: {
            Layout: {
              siderBg: 'transparent',
            },
            Divider: {
              colorSplit: '#fff',
            },
          },
        }}
      >
        <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID as string}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <Layout>
                  <Content className="min-h-screen h-screen hero-bg">
                    <Component {...pageProps} />
                  </Content>
                </Layout>
              </ToastProvider>

              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </Provider>
        </GoogleOAuthProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
