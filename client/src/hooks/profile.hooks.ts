import { Context, createContext, useContext } from 'react';

import { ProfileProps } from '@components/ProfileProvider';

export const ProfileContext: Context<ProfileProps | null> =
  createContext<ProfileProps | null>(null);

export const useViewProfile = (): ProfileProps => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
