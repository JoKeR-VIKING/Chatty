import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@src/store';
import { setUser, clearUser } from '@store/user.slice';
import { useUserStatus } from '@hooks/user.hooks';

type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const dispatch: AppDispatch = useDispatch();
  const { isPending, isSuccess, data, error } = useUserStatus();

  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        dispatch(setUser(data?.data?.user));
      } else {
        dispatch(clearUser());
      }
    }
  }, [dispatch, isPending, isSuccess, data, error]);

  return <>{children}</>;
};

export default AuthProvider;
