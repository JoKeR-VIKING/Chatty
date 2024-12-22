import { Context, createContext, useContext } from 'react';

import { ToastProps } from '@components/ToastProvider';

export const ToastContext: Context<ToastProps | null> =
  createContext<ToastProps | null>(null);

export const useToast = () => {
  const context: ToastProps | null = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
