import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Flex, Menu, Avatar, Typography, Image } from 'antd';
import type { GetProp, MenuProps } from 'antd';

import { IUser } from '@interfaces/user.interface';
import { AppDispatch, RootState } from '@src/store';
import { setSelectedChat, setConversationId } from '@store/chat.slice';
import { useGetConversation } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';
import NoResultsFoundImage from '@public/NoResultsFound.png';

type MenuItem = GetProp<MenuProps, 'items'>[number];

type Props = {
  results: IUser[];
  setSearchListOpen: Dispatch<SetStateAction<boolean>>;
  searchPrefix: string;
};

const { Paragraph } = Typography;

const SearchResults: React.FC<Props> = (props) => {
  const { results, setSearchListOpen, searchPrefix } = props;

  const dispatch: AppDispatch = useDispatch();
  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<IUser | null>(null);

  const { isPending, isSuccess, data, error } = useGetConversation(
    user?._id as string,
    selectedChatUser?._id as string,
  );

  const handleSelect = (_id: string) => {
    setSelectedChatUser(results?.find((result) => result._id === _id) as IUser);
  };

  useEffect(() => {
    if (!results?.length) {
      setMenuItems([
        {
          key: 1,
          label: (
            <Flex justify="start" align="center">
              {searchPrefix.length > 3 ? (
                <>
                  <Image
                    height={40}
                    preview={false}
                    src={NoResultsFoundImage.src}
                  />
                  <Paragraph className="ml-2">
                    Sorry, no results found!
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph className="ml-2 text-wrap text-center">
                    Type atleast 4 characters to start searching
                  </Paragraph>
                </>
              )}
            </Flex>
          ),
          disabled: true,
          className: 'cursor-default',
        },
      ]);
      return;
    }

    const menuItems: MenuItem[] = results?.map(
      (user: IUser) =>
        ({
          key: user?._id,
          label: (
            <Flex className="friends-list-item" justify="start" align="center">
              <Avatar className="mr-4" src={user?.googlePicture} />
              <Paragraph>{user?.googleName}</Paragraph>
            </Flex>
          ),
        }) as MenuItem,
    );

    setMenuItems(menuItems);
  }, [results]);

  useEffect(() => {
    if (!selectedChatUser) return;

    if (!isPending) {
      if (isSuccess) {
        dispatch(setSelectedChat(selectedChatUser));
        dispatch(setConversationId(data?.data?.conversationId as string));
        setSearchListOpen(false);
      } else {
        setSelectedChatUser(null);
        createToast('error', error?.message);
      }
    }
  }, [
    isPending,
    isSuccess,
    data,
    error,
    selectedChatUser,
    dispatch,
    createToast,
  ]);

  return (
    <Flex className="friends-search-box" justify="center" align="center">
      <Menu items={menuItems} onSelect={({ key }) => handleSelect(key)} />
    </Flex>
  );
};

export default SearchResults;
