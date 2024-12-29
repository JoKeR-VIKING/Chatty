import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Flex, Menu, GetProp, MenuProps, Typography, Spin } from 'antd';

import { IRecentChat } from '@interfaces/chat.interface';
import { IUser } from '@interfaces/user.interface';
import TruncatedText from '@components/TruncatedText';
import { AppDispatch, RootState } from '@src/store';
import { setConversationId, setSelectedChat } from '@store/chat.slice';
import { useGetRecentChats } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';

type MenuItemType = GetProp<MenuProps, 'items'>[number];

const { Paragraph } = Typography;

const RecentChats = () => {
  const { createToast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { conversationId } = useSelector((state: RootState) => state.chat);

  const [recentChats, setRecentChats] = useState<MenuItemType[]>([]);
  const { isPending, isSuccess, data, error } = useGetRecentChats(
    user?._id as string,
  );

  const handleSelect = (conversationId: string) => {
    if (isPending) return;

    const selectedChat: IRecentChat = data?.data?.chatList?.find(
      (recentChat: IRecentChat) => recentChat.conversationId === conversationId,
    ) as IRecentChat;

    dispatch(setSelectedChat(selectedChat?.userDetails as IUser));
    dispatch(setConversationId(conversationId));
  };

  useEffect(() => {
    (async () => {
      if (!isPending) {
        if (isSuccess) {
          const userDetailsPromises = data?.data?.chatList?.map(
            async (chat: IRecentChat) => {
              return {
                key: chat?.conversationId,
                label: (
                  <Flex justify="start" align="center">
                    <Avatar
                      size="large"
                      src={chat?.userDetails?.googlePicture}
                    />

                    <Flex vertical>
                      <Paragraph>{chat?.userDetails?.googleName}</Paragraph>
                      <TruncatedText
                        text={`${chat?.messageFrom === user?._id ? 'You: ' : ''}${chat?.message}`}
                      />
                    </Flex>
                  </Flex>
                ),
              } as MenuItemType;
            },
          );

          Promise.all(userDetailsPromises)
            .then((recentChats) => setRecentChats(recentChats))
            .catch((error) => createToast('error', error.message));
        } else {
          createToast('error', error.message);
        }
      }
    })();
  }, [isPending, isSuccess, data, error, user, createToast]);

  return (
    <Flex
      className="recent-chats"
      justify="space-between"
      align="center"
      vertical
    >
      {!recentChats.length ? (
        <Spin size="large" />
      ) : (
        <Menu
          mode="vertical"
          items={recentChats}
          onSelect={({ key }) => handleSelect(key)}
          selectedKeys={[conversationId]}
        />
      )}
    </Flex>
  );
};

export default RecentChats;
