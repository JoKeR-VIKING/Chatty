import React from 'react';
import { notification } from 'antd';

import { ToastContext } from '@hooks/toast.hooks';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type ToastProps = {
  createToast: (
    type: NotificationType,
    message: string,
    description?: string,
  ) => void;
};

type Props = {
  children: React.ReactNode;
};

const ToastProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [api, contextHolder] = notification.useNotification();

  const createToast = (
    type: NotificationType,
    message: string,
    description?: string,
  ) => {
    api[type]({
      message,
      description,
      showProgress: true,
      pauseOnHover: true,
      closable: false,
      placement: 'topRight',
      duration: 3,
    });
  };

  return (
    <ToastContext.Provider value={{ createToast }}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
