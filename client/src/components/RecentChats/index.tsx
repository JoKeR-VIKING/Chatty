import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Flex, Menu, GetProp, MenuProps, Typography, Spin } from 'antd';

import { IChat } from '@interfaces/chat.interface';
import { IUser } from '@interfaces/user.interface';
import TruncatedText from '@components/TruncatedText';
import { RootState } from '@src/store';
// import { setSelectedChat } from '@store/chat.slice';
import { useGetRecentChats } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';
import { getUserDetailsApi } from '@api/user.api';

type MenuItemType = GetProp<MenuProps, 'items'>[number];

const { Paragraph } = Typography;

const RecentChats = () => {
  const { createToast } = useToast();
  // const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [recentChats, setRecentChats] = useState<MenuItemType[]>([]);
  const { isPending, isSuccess, data, error } = useGetRecentChats(
    user?.id as string,
  );

  useEffect(() => {
    (async () => {
      if (!isPending) {
        if (isSuccess) {
          const userDetailsPromises = data?.data?.chatList?.map(
            async (chat: IChat) => {
              const userDetailResponse = await getUserDetailsApi(
                chat.messageTo,
              );
              const userDetail: IUser = userDetailResponse?.data?.user;

              return {
                key: chat?.conversationId,
                label: (
                  <Flex justify="start" align="center">
                    <Avatar size="large" src={userDetail?.googlePicture} />

                    <Flex vertical>
                      <Paragraph>{userDetail?.googleName}</Paragraph>
                      <TruncatedText
                        text={`${chat?.messageFrom === user?.id ? 'You: ' : ''}${chat?.message}`}
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
        <Menu mode="vertical" items={recentChats} onSelect={() => {}} />
      )}
    </Flex>
  );
};

export default RecentChats;
