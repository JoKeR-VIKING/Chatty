import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Flex, Avatar, Typography, Input } from 'antd';

import { RootState } from '@src/store';

const { Header } = Layout;
const { Paragraph } = Typography;
const { Search } = Input;

const ChatHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Header className="chat-header">
      <Flex className="w-full h-14 p-6" justify="flex-start" align="center">
        <Avatar size="large" src={user?.googlePicture} draggable={false} />
        <Paragraph className="chat-user-name">{user?.googleName}</Paragraph>
      </Flex>

      <Search size="large" className="search-box" placeholder="Search..." />
    </Header>
  );
};

export default ChatHeader;
