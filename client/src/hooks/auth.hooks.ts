import { useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@src/store';
import { setUser, clearUser } from '@store/user.slice.ts';
import { useToast } from '@hooks/toast.hooks';
import { useUserStatus } from '@hooks/user.hooks';

const publicRoutes = ['/', '/auth'];
const privateRoutes = ['/chat'];

export const useAuthCheck = () => {
  const router: NextRouter = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { createToast } = useToast();

  const { isPending, isSuccess, data, error } = useUserStatus();

  useEffect(() => {
    (async () => {
      if (!isPending) {
        if (isSuccess) {
          dispatch(setUser(data?.data?.user));
          if (publicRoutes.includes(router.pathname)) {
            await router.replace('/chat');
          }
        } else {
          dispatch(clearUser());

          if (privateRoutes.includes(router.pathname)) {
            createToast('error', error?.response?.data?.message as string);
          }

          await router.replace('/auth');
        }
      }
    })();
  }, [
    createToast,
    data?.data?.user,
    dispatch,
    error?.response?.data?.message,
    isPending,
    isSuccess,
    router,
  ]);
};
