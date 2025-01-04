import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Layout, Flex, Typography, Image, Spin, Button } from 'antd';
import { Icon } from '@iconify/react';

import { IChat } from '@interfaces/chat.interface';
import ChatMessageBox from '@components/Chat/ChatMessageBox';
import { AppDispatch, RootState } from '@src/store';
import { useGetChats, useReadMessage, useSearchChats } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';
import { formatDateToTime } from '@utils/helpers';
import socket from '@sockets/index';
import NoChatSelectedImage from '@public/NoChatSelected.png';

const { Content } = Layout;
const { Text } = Typography;

type Props = {
  setSearchChats: Dispatch<SetStateAction<IChat[]>>;
  messagesRef: MutableRefObject<Map<string, HTMLElement>>;
};

const ChatContent: React.FC<Props> = (props) => {
  const { setSearchChats, messagesRef } = props;

  const dispatch: AppDispatch = useDispatch();
  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  const { conversationId, searchChatPrefix } = useSelector(
    (state: RootState) => state.chat,
  );

  const [chats, setChats] = useState<IChat[]>([]);
  const [initial, setInitial] = useState(true);
  const [isScrolledAtBottom, setIsScrolledAtBottom] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const { isPending, isSuccess, data, error } = useGetChats(
    conversationId,
    user?._id as string,
  );
  const {
    isPending: searchChatPending,
    isSuccess: searchChatSuccess,
    data: searchChatData,
    error: searchChatError,
  } = useSearchChats(conversationId, searchChatPrefix);
  const { mutate } = useReadMessage();

  const setMessageRef = (id: string, node: HTMLElement | null) => {
    if (node) messagesRef.current.set(id, node);
    else messagesRef.current.delete(id);
  };

  const isAtBottom = () => {
    if (!contentRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 100;

    setIsScrolledAtBottom(isAtBottom);
  };

  useEffect(() => {
    setChats([]);
    setInitial(true);
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (!isPending && isSuccess) {
      setChats(data.data.chats);
    } else if (error) {
      createToast('error', error.message);
    }
  }, [isPending, isSuccess, data, error, createToast, messagesRef]);

  useEffect(() => {
    if (!searchChatPending && searchChatSuccess) {
      setSearchChats(searchChatData?.data?.chats);
    } else if (searchChatError) {
      createToast('error', searchChatError.message);
    }
  }, [
    searchChatPending,
    searchChatSuccess,
    searchChatData,
    searchChatError,
    createToast,
    setSearchChats,
  ]);

  useEffect(() => {
    const handleNewMessage = (newChat: IChat) => {
      if (newChat?.conversationId !== conversationId) return;

      if (newChat?.messageTo === user?._id) {
        mutate(newChat?._id);
        newChat.isRead = true;
      }

      setChats((prevState) => {
        if (!prevState.some((chat) => chat._id === newChat._id)) {
          return [...prevState, newChat];
        }
        return prevState;
      });
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [conversationId, user?._id, mutate]);

  useEffect(() => {
    const handleNewReaction = (updatedChat: IChat) => {
      setChats((prevState) => {
        return prevState.map((chat) => {
          if (chat._id === updatedChat?._id)
            return { ...chat, reaction: updatedChat?.reaction };

          return chat;
        });
      });
    };

    socket.on('new-reaction', handleNewReaction);

    return () => {
      socket.off('new-reaction', handleNewReaction);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      isAtBottom();
    };

    const content = contentRef.current;
    content?.addEventListener('scroll', handleScroll);

    return () => {
      content?.removeEventListener('scroll', handleScroll);
    };
  }, [isPending]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (!chats.length || !contentRef.current) return;

      const { scrollHeight } = contentRef.current;

      if (initial && !isPending) {
        contentRef.current.scrollTop = scrollHeight;
        setInitial(false);
      } else if (isScrolledAtBottom && !isPending) {
        contentRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    scrollToBottom();
  }, [chats, initial, isPending, messagesRef, isScrolledAtBottom]);

  useEffect(() => {
    const handleReadMessage = (chat: IChat) => {
      if (!messagesRef.current.has(chat?._id)) return;

      setChats((prev) => {
        return prev.map((currChat) => {
          if (currChat?._id === chat?._id) {
            return {
              ...currChat,
              isRead: chat?.isRead,
            };
          }

          return currChat;
        });
      });
    };

    socket.on('read-chat', handleReadMessage);
    return () => {
      socket.off('read-chat', handleReadMessage);
    };
  }, [messagesRef]);

  useEffect(() => {
    const handleUpdatedMessages = (chats: IChat[]) => {
      if (chats?.[0]?.conversationId.toString() !== conversationId) return;
      setChats(chats);
    };

    socket.on('updated-messages', handleUpdatedMessages);
    return () => {
      socket.off('updated-messages', handleUpdatedMessages);
    };
  }, [conversationId]);

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

  if (isPending) {
    return (
      <Content className="chat-content relative" ref={contentRef}>
        <Flex className="chat-message-main" vertical justify="center">
          <Spin size="large" />
        </Flex>
      </Content>
    );
  }

  return (
    <Content className={`chat-content relative`} ref={contentRef}>
      <Flex className="chat-message-main relative" vertical justify="flex-end">
        {chats?.map((chat: IChat) => (
          <Flex
            ref={(node) => setMessageRef(chat?._id, node)}
            key={chat?._id}
            className={`${chat?.messageFrom === user?._id ? 'items-end' : ''}`}
            vertical
          >
            <ChatMessageBox
              chat={chat}
              searchChatPrefix={searchChatPrefix}
              messagesRef={messagesRef}
            />

            <Flex align="center">
              <Text
                className={`chat-time ${
                  chat?.messageFrom === user?._id ? 'mr-1.5' : 'ml-1.5'
                }`}
              >
                {formatDateToTime(chat?.createdAt)}
              </Text>
            </Flex>
          </Flex>
        ))}

        <Button
          className={`scroll-to-bottom-btn ${!isScrolledAtBottom ? 'btn-visible' : 'btn-hidden'}`}
          type="primary"
          icon={
            <Icon icon="material-symbols:keyboard-double-arrow-down-rounded" />
          }
          onClick={() => {
            if (contentRef.current) {
              contentRef.current.scrollTo({
                top: contentRef.current.scrollHeight,
                behavior: 'smooth',
              });
            }
          }}
        />
      </Flex>
    </Content>
  );
};

export default ChatContent;
