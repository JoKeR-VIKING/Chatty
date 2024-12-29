import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import { ConfigProvider, Layout, theme } from 'antd';

import Config from '@utils/config';
import ToastProvider from '@components/ToastProvider';
import AuthProvider from '@components/AuthProvider';
import store from '@store/index';

import Logo from '@public/Logo.jpg';
import 'animate.css';
import 'video.js/dist/video-js.css';
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
        <link rel="icon" href={Logo.src} />
        <title>Chatty</title>
      </Head>

      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: 'darkcyan',
            colorTextBase: '#005353',
          },
          components: {
            Layout: {
              siderBg: 'transparent',
            },
            Input: {
              colorBgContainer: 'darkcyan',
              colorText: '#f9f8fd',
              colorTextPlaceholder: '#f9f8fd',
            },
            Divider: {
              colorSplit: '#fff',
            },
            Spin: {
              colorPrimary: '#fff',
            },
            Menu: {
              colorBgContainer: 'darkcyan',
              itemSelectedBg: 'darkcyan',
            },
            Tooltip: {
              colorBgSpotlight: 'darkcyan',
            },
            Slider: {
              railBg: '#414a4c',
            },
          },
        }}
      >
        <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID as string}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ToastProvider>
                  <Layout className="bg-transparent">
                    <Content className="min-h-screen h-screen hero-bg">
                      <Component {...pageProps} />
                    </Content>
                  </Layout>
                </ToastProvider>
              </AuthProvider>

              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </Provider>
        </GoogleOAuthProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
