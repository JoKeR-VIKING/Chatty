import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Layout, Flex, Typography, Image } from 'antd';
import { Icon } from '@iconify/react';

import { IChat } from '@interfaces/chat.interface';
import { RootState } from '@src/store';
import { useGetChats } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';
import { formatDateToTime } from '@utils/helpers';
import NoChatSelectedImage from '@public/NoChatSelected.png';

const { Content } = Layout;
const { Paragraph, Text } = Typography;

const ChatContent: React.FC = () => {
  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  const { conversationId } = useSelector((state: RootState) => state.chat);

  const [chats, setChats] = useState<IChat[]>([]);

  const { isPending, isSuccess, data, error } = useGetChats(conversationId);

  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        setChats(data?.data?.chats);
      } else {
        createToast('error', error.message);
      }
    }
  }, [isPending, isSuccess, data, error, createToast]);

  if (!conversationId) {
    return (
      <Flex className="h-full" justify="center" align="center" vertical>
        <Image width={700} src={NoChatSelectedImage.src} preview={false} />
        <Text className="font-pacifico font-extralight text-offwhite text-[1.7rem] m-6">
          Choose a conversation to begin your Chatty journey!
        </Text>
      </Flex>
    );
  }

  return (
    <Content className="chat-content">
      <Flex className="chat-message-main" vertical justify="flex-end">
        {chats?.map((chat: IChat) => (
          <Flex
            key={chat?._id}
            className={`${chat?.messageFrom === user?.id ? 'items-end' : ''}`}
            vertical
          >
            <Flex
              className={`chat-message-box ${chat?.messageFrom === user?.id ? 'chat-your' : 'chat-them'}`}
              align="flex-end"
            >
              <Paragraph
                className={`chat-message ${chat?.messageFrom === user?.id && 'max-w-[95%]'}`}
              >
                {chat?.message}
              </Paragraph>

              {chat?.messageFrom === user?.id && (
                <Icon
                  className={`read-icon ${!chat?.isRead ? 'text-softblack' : 'text-[#19c5ff]'}`}
                  width="20"
                  height="20"
                  icon="charm:tick-double"
                />
              )}
            </Flex>
            <Flex align="center">
              <Text
                className={`chat-time ${chat?.messageFrom === user?.id ? 'mr-1.5' : 'ml-1.5'}`}
              >
                {formatDateToTime(chat?.createdAt)}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Content>
  );
};

export default ChatContent;
