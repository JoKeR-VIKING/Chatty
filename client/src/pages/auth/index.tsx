import React from 'react';
import { useRouter, NextRouter } from 'next/router';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { AxiosError, AxiosResponse } from 'axios';

import { Flex, Button, Typography, Divider, Spin } from 'antd';
import { Icon } from '@iconify/react';

import { IApiResponse } from '@src/interfaces';
import { IUserRequest } from '@interfaces/user.interface.ts';
import { useToast } from '@hooks/toast.hooks';
import { useLogin } from '@hooks/user.hooks';
import { useAuthCheck } from '@hooks/auth.hooks.ts';

const { Paragraph } = Typography;

const AuthWindow: React.FC = () => {
  useAuthCheck();

  const router: NextRouter = useRouter();
  const { createToast } = useToast();

  const onLoginSuccess = async (data: AxiosResponse<IApiResponse>) => {
    createToast('success', data?.data?.message);
    await router.replace('/chat');
  };

  const onLoginError = (error: AxiosError<IApiResponse>) => {
    createToast('error', error?.response?.data?.message as string);
  };

  const { mutate, isPending } = useLogin({ onLoginSuccess, onLoginError });

  const login = useGoogleLogin({
    onSuccess: (response: TokenResponse) =>
      mutate({ accessToken: response?.access_token } as IUserRequest),
    onError: () => console.log('Login error'),
  });

  return (
    <>
      {isPending ? (
        <Flex justify="center" align="center" className="h-full">
          <Spin size="large" />
        </Flex>
      ) : (
        <Flex justify="center" align="center" className="h-full">
          <Flex
            justify="center"
            align="center"
            vertical
            className="w-[60%] h-[60%] rounded-xl"
          >
            <Paragraph className="font-pacifico text-6xl text-white animate__animated animate__fadeInLeft">
              Chatty
            </Paragraph>
            <Paragraph className="font-chivo font-[400] text-3xl text-white text-center tracking-[0.2em] uppercase animate__animated animate__fadeInRight">
              Where conversations happen
            </Paragraph>
            <Divider orientation="center" className="font-nunito text-white">
              Continue with
            </Divider>
            <Button
              type="default"
              icon={<Icon icon="logos:google-icon" />}
              onClick={() => login()}
              className="p-5 text-[0.9rem] rounded-3xl animate__animated animate__fadeInUp"
            >
              Sign in with Google
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default AuthWindow;
