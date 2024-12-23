import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Flex, Button, Avatar, Typography, Input } from 'antd';

import { RootState } from '@src/store';

const { Header } = Layout;
const { Paragraph } = Typography;
const { Search } = Input;

const ChatHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Header className="chat-header">
      <Flex className="w-full h-14" justify="flex-start" align="center">
        <Button className="p-6" type="text">
          <Avatar size="large" src={user?.googlePicture} draggable={false} />

          <Paragraph
            className="font-chivo text-xl"
            style={{ margin: 0, marginLeft: '0.75rem' }}
          >
            {user?.googleName}
          </Paragraph>
        </Button>
      </Flex>

      <Search size="large" className="p-3 font-thin" placeholder="Search..." />
    </Header>
  );
};

export default ChatHeader;
