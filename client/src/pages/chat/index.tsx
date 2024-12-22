import React from 'react';
import { Layout } from 'antd';

import Sidebar from '@components/Sidebar';
import { useAuthCheck } from '@hooks/auth.hooks.ts';

const ChatWindow: React.FC = () => {
  useAuthCheck();

  return (
    <Layout className="chat-window" hasSider>
      <Sidebar />
    </Layout>
  );
};

export default ChatWindow;
