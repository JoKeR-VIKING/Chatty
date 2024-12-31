import React, { useRef, useState } from 'react';
import { Layout } from 'antd';

import { IChat } from '@interfaces/chat.interface.ts';
import ChatHeader from '@components/Chat/ChatHeader';
import ChatContent from '@components/Chat/ChatContent';
import ChatFooter from '@components/Chat/ChatFooter';

const Chat: React.FC = () => {
  const [searchChats, setSearchChats] = useState<IChat[]>([]);
  const messagesRef = useRef(new Map<string, HTMLElement>());

  return (
    <Layout className="chat-main">
      <ChatHeader searchChats={searchChats} messagesRef={messagesRef} />
      <ChatContent setSearchChats={setSearchChats} messagesRef={messagesRef} />
      <ChatFooter />
    </Layout>
  );
};

export default Chat;
