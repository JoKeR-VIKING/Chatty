import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, NextRouter } from 'next/router';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { AxiosError, AxiosResponse } from 'axios';

import { Flex, Button, Typography, Divider, Spin } from 'antd';
import { Icon } from '@iconify/react';

import { AppDispatch } from '@src/store';
import { setUser } from '@store/user.slice';
import { IApiResponse } from '@src/interfaces';
import { IUserRequest, IUserResponse } from '@interfaces/user.interface';
import { useToast } from '@hooks/toast.hooks';
import { useLogin } from '@hooks/user.hooks';
import socket from '@src/sockets';

const { Paragraph } = Typography;

const AuthWindow: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router: NextRouter = useRouter();
  const { createToast } = useToast();

  const onLoginSuccess = async (data: AxiosResponse<IUserResponse>) => {
    createToast('success', data?.data?.message);
    dispatch(setUser(data?.data?.user));
    socket.emit('register', data?.data?.user?._id);
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
              className="glass-btn hero-btn animate__animated animate__fadeInUp"
              type="default"
              icon={<Icon icon="logos:google-icon" />}
              onClick={() => login()}
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
