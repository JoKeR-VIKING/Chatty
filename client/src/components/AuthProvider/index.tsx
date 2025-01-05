import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NextRouter, useRouter } from 'next/router';

import { AppDispatch } from '@src/store';
import { setUser, clearUser } from '@store/user.slice';
import { useUserStatus } from '@hooks/user.hooks';
import socket from '@sockets/index';

type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const router: NextRouter = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isPending, isSuccess, data, error } = useUserStatus();

  useEffect(() => {
    (async () => {
      if (!isPending) {
        if (isSuccess) {
          dispatch(setUser(data?.data?.user));
          socket.emit('register', data?.data?.user?._id);
          await router.replace('/chat');
        } else {
          await router.replace('/auth');
          dispatch(clearUser());
        }
      }
    })();
  }, [dispatch, isPending, isSuccess, data, error]);

  return <>{children}</>;
};

export default AuthProvider;
