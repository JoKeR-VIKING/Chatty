import React from 'react';
import { Layout } from 'antd';

import ChatHeader from '@components/Chat/ChatHeader';
import ChatContent from '@components/Chat/ChatContent';
import ChatFooter from '@components/Chat/ChatFooter';

const Chat: React.FC = () => {
  return (
    <Layout className="chat-main">
      <ChatHeader />
      <ChatContent />
      <ChatFooter />
    </Layout>
  );
};

export default Chat;
