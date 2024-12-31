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

  const scrollToMessage = (id: string) => {
    const messageNode = messagesRef.current.get(id);
    if (messageNode)
      messageNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSearch = debounce(async (searchPrefix: string) => {
    dispatch(setSearchChatPrefix(searchPrefix));
  }, 500);

  useEffect(() => {
    setSearchIndex(searchChats.length - 2);
    scrollToMessage(searchChats[searchChats.length - 1]?._id);
  }, [searchChats]);

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

      <Flex className="w-[80%]" justify="center" align="center">
        <Search
          size="large"
          className="search-box pr-0 border-none"
          placeholder="Search..."
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          className="glass-btn p-5 ml-3 mr-1 border border-solid border-offwhite rounded-full"
          icon={<Icon icon={'fe:arrow-up'} />}
          disabled={searchIndex < 0}
          onClick={() => {
            setSearchIndex(searchIndex - 1);
            scrollToMessage(searchChats[searchIndex]?._id);
          }}
        />
        <Button
          className="glass-btn p-5 ml-1 mr-3 border border-solid border-offwhite rounded-full"
          icon={<Icon icon={'fe:arrow-down'} />}
          disabled={searchIndex < -1 || searchIndex >= searchChats.length - 1}
          onClick={() => {
            setSearchIndex(searchIndex + 1);
            scrollToMessage(searchChats[searchIndex]?._id);
          }}
        />
      </Flex>
    </Header>
  );
};

export default ChatHeader;
