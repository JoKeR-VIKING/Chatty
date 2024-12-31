import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

import { Layout, Flex, Typography, Image } from 'antd';
import { Icon } from '@iconify/react';

import { IChat } from '@interfaces/chat.interface';
import AudioPlayer from '@components/AudioPlayer';
import ChatText from '@components/Chat/ChatText';
import { RootState } from '@src/store';
import { useGetChats, useSearchChats } from '@hooks/chat.hooks';
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

  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  const { conversationId, searchChatPrefix } = useSelector(
    (state: RootState) => state.chat,
  );

  const [chats, setChats] = useState<IChat[]>([]);
  const [initial, setInitial] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { isPending, isSuccess, data, error } = useGetChats(
    conversationId,
    pageNumber,
  );
  const {
    isPending: searchChatPending,
    isSuccess: searchChatSuccess,
    data: searchChatData,
    error: searchChatError,
  } = useSearchChats(conversationId, searchChatPrefix);

  const setMessageRef = (id: string, node: HTMLElement | null) => {
    if (node) messagesRef.current.set(id, node);
    else messagesRef.current.delete(id);
  };

  useEffect(() => {
    setChats([]);
    setPageNumber(1);
    setInitial(true);
    setIsSwitchingChat(true);
  }, [conversationId]);

  useEffect(() => {
    if (!isPending && isSuccess) {
      setTotalPages(data?.data?.totalPages);
      setChats((prevState: IChat[]) => {
        if (isSwitchingChat) {
          setIsSwitchingChat(false);
          return data.data.chats;
        }

        const newMessages = data.data.chats.filter(
          (newChat) => !prevState.some((chat) => chat._id === newChat._id),
        );
        return [...newMessages, ...prevState];
      });
    } else if (error) {
      createToast('error', error.message);
    }
  }, [isPending, isSuccess, data, error, isSwitchingChat, createToast]);

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
  }, [conversationId]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (!chats.length || !contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 80;

      if (initial) {
        contentRef.current.scrollTop = scrollHeight;
        setInitial(false);
      } else if (isAtBottom) {
        contentRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    setTimeout(scrollToBottom, 0);
  }, [chats, initial]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || isPending) return;

      const { scrollTop } = contentRef.current;
      if (scrollTop < 100)
        setPageNumber((prevState) => {
          if (prevState === totalPages) return prevState;

          return prevState + 1;
        });
    };

    const container = contentRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [totalPages, chats.length, isPending]);

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
    <Content className="chat-content" ref={contentRef}>
      <Flex className="chat-message-main" vertical justify="flex-end">
        {chats?.map((chat: IChat) => (
          <Flex
            ref={(node) => setMessageRef(chat?._id, node)}
            key={chat?._id}
            className={`${chat?.messageFrom === user?._id ? 'items-end' : ''}`}
            vertical
          >
            <Flex
              className={`chat-message-box ${
                chat?.message &&
                (chat?.messageFrom === user?._id ? 'chat-your' : 'chat-them')
              }`}
              align="flex-end"
            >
              {chat?.message ? (
                <ChatText
                  messageFrom={chat?.messageFrom}
                  message={chat?.message}
                  searchTerm={searchChatPrefix}
                />
              ) : (
                <>
                  {(
                    mime.lookup(chat?.attachmentName) ||
                    'application/octet-stream'
                  ).startsWith('image/') ? (
                    <Image
                      className="chat-image"
                      src={chat?.attachmentData}
                      width={400}
                    />
                  ) : (
                    <AudioPlayer src={chat?.attachmentData} />
                  )}
                </>
              )}

              {chat?.messageFrom === user?._id && (
                <Icon
                  className={`read-icon ${
                    !chat?.isRead ? 'text-softblack' : 'text-[#19c5ff]'
                  }`}
                  width="20"
                  height="20"
                  icon="charm:tick-double"
                />
              )}
            </Flex>
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
      </Flex>
    </Content>
  );
};

export default ChatContent;
