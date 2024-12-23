import React from 'react';
import { Layout } from 'antd';

import Sidebar from '@components/Sidebar';
import Chat from '@components/Chat';

const ChatWindow: React.FC = () => {
  return (
    <Layout className="chat-window" hasSider>
      <Sidebar />
      <Chat />
    </Layout>
  );
};

export default ChatWindow;
