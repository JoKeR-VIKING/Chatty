import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Layout,
  Flex,
  Avatar,
  Typography,
  Input,
  Dropdown,
  MenuProps,
  Button,
} from 'antd';
import { Icon } from '@iconify/react';

import { AppDispatch, RootState } from '@src/store';
import { removeSelectedChat } from '@store/chat.slice';

const { Header } = Layout;
const { Paragraph } = Typography;
const { Search } = Input;

const ChatHeader: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedChatUser } = useSelector((state: RootState) => state.chat);

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          className="glass-btn close-chat-btn"
          icon={<Icon icon="majesticons:close-line" width={20} height={20} />}
          onClick={() => dispatch(removeSelectedChat())}
        >
          Close chat
        </Button>
      ),
    },
  ];

  if (!selectedChatUser) {
    return <></>;
  }

  return (
    <Header className="chat-header">
      <Dropdown
        overlayClassName="chat-menu"
        className="chat-menu-box"
        menu={{ items: menuItems }}
        arrow={true}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Flex justify="flex-start" align="center">
          <Avatar
            size="large"
            src={selectedChatUser?.googlePicture}
            draggable={false}
          />
          <Paragraph className="chat-user-name">
            {selectedChatUser?.googleName}
          </Paragraph>
        </Flex>
      </Dropdown>

      <Search size="large" className="search-box" placeholder="Search..." />
    </Header>
  );
};

export default ChatHeader;
