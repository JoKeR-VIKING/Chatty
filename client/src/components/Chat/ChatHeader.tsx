import React, { useState, useEffect, MutableRefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';

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

import { IChat } from '@interfaces/chat.interface';
import { AppDispatch, RootState } from '@src/store';
import { removeSelectedChat, setSearchChatPrefix } from '@store/chat.slice';
import { scrollToMessage } from '@utils/helpers';
import socket from '@src/sockets';

const { Header } = Layout;
const { Paragraph } = Typography;
const { Search } = Input;

type Props = {
  searchChats: IChat[];
  messagesRef: MutableRefObject<Map<string, HTMLElement>>;
};

const ChatHeader: React.FC<Props> = (props) => {
  const { searchChats, messagesRef } = props;

  const dispatch: AppDispatch = useDispatch();
  const { selectedChatUser } = useSelector((state: RootState) => state.chat);

  const [searchIndex, setSearchIndex] = useState(-1);
  const [isOnline, setIsOnline] = useState(false);

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

  const handleSearch = debounce(async (searchPrefix: string) => {
    dispatch(setSearchChatPrefix(searchPrefix));
  }, 500);

  useEffect(() => {
    socket.emit('get-online', selectedChatUser?._id);

    const handleUserOnline = (userOnlineStatus: {
      _id: string;
      status: boolean;
    }) => {
      if (selectedChatUser?._id === userOnlineStatus?._id)
        setIsOnline(userOnlineStatus?.status);
    };

    socket.on('post-online', handleUserOnline);
    return () => {
      socket.off('post-online', handleUserOnline);
    };
  }, [selectedChatUser?._id]);

  useEffect(() => {
    (async () => {
      scrollToMessage(messagesRef, searchChats[searchChats.length - 1]?._id);
      setSearchIndex(searchChats.length - 1);
    })();
  }, [searchChats, messagesRef]);

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
        <Flex vertical justify="center" align="flex-start">
          <Flex justify="flex-start" align="center">
            <Avatar
              size="default"
              src={selectedChatUser?.googlePicture}
              draggable={false}
            />
            <Paragraph className="chat-user-name text-lg">
              {selectedChatUser?.googleName}
            </Paragraph>
          </Flex>

          <Flex className="self-end" justify="space-between" align="center">
            <Icon
              icon={
                isOnline
                  ? 'fluent-emoji:green-circle'
                  : 'fluent-emoji:red-circle'
              }
            />

            <Paragraph className="m-0 ml-1">
              {isOnline ? 'online' : 'offline'}
            </Paragraph>
          </Flex>
        </Flex>
      </Dropdown>

      <Flex className="w-[40%]" justify="center" align="center">
        <Search
          size="large"
          className="search-box pr-0 border-none"
          placeholder="Search..."
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          className="glass-btn p-5 ml-3 mr-1 border border-solid border-offwhite rounded-full"
          icon={<Icon color="darkcyan" icon={'fe:arrow-up'} />}
          disabled={searchIndex <= 0}
          onClick={async () => {
            const newIndex = searchIndex - 1;

            scrollToMessage(messagesRef, searchChats[newIndex]?._id);
            setSearchIndex(newIndex);
          }}
        />
        <Button
          className="glass-btn p-5 ml-1 mr-3 border border-solid border-offwhite rounded-full"
          icon={<Icon color="darkcyan" icon={'fe:arrow-down'} />}
          disabled={searchIndex < 0 || searchIndex >= searchChats.length - 1}
          onClick={async () => {
            const newIndex = searchIndex + 1;

            scrollToMessage(messagesRef, searchChats[newIndex]?._id);
            setSearchIndex(newIndex);
          }}
        />
      </Flex>
    </Header>
  );
};

export default ChatHeader;
