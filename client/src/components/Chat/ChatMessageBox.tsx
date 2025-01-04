import React, { MutableRefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mime from 'mime-types';

import { Flex, Image, Tooltip, Button, Typography } from 'antd';
import { Icon } from '@iconify/react';

import { IChat } from '@interfaces/chat.interface';
import ChatText from '@components/Chat/ChatText';
import TruncatedText from '@components/TruncatedText';
import AudioPlayer from '@components/AudioPlayer';
import ReactionBar from '@components/ReactionBar';
import { AppDispatch, RootState } from '@src/store';
import { setReplyChat } from '@store/chat.slice';
import { scrollToMessage } from '@utils/helpers';

const { Text } = Typography;

type Props = {
  chat: IChat;
  searchChatPrefix: string;
  messagesRef: MutableRefObject<Map<string, HTMLElement>>;
};

const ChatMessageBox: React.FC<Props> = (props) => {
  const { chat, searchChatPrefix, messagesRef } = props;

  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const handleReply = (
    id: string,
    message: string,
    attachmentData: string,
    messageFrom: string,
  ) => {
    dispatch(
      setReplyChat({
        _id: id,
        message: message,
        attachmentData: attachmentData,
        messageFrom: messageFrom,
      }),
    );
  };

  const goToReply = () => {
    scrollToMessage(messagesRef, chat?.replyMessageId?._id);
  };

  return (
    <Tooltip
      placement="top"
      title={<ReactionBar chatId={chat?._id} chatReaction={chat?.reaction} />}
    >
      <Flex className="chat-reply-box" vertical>
        {chat?.replyMessageId && (
          <Flex
            justify={chat?.replyMessageId?.attachmentData && 'center'}
            align="flex-start"
            vertical
            className={`message-reply-main ${chat?.replyMessageId && 'cursor-pointer'}`}
            onClick={goToReply}
          >
            <Flex vertical>
              <Text className="message-reply-text">
                {chat?.replyMessageId?.messageFrom === user?._id ? 'You' : ''}
              </Text>
              <TruncatedText
                text={chat?.replyMessageId?.message}
                length={120}
              />
            </Flex>

            {chat?.replyMessageId?.attachmentData && (
              <Image
                src={chat?.replyMessageId?.attachmentData}
                alt="attachment"
                preview={false}
                width={150}
              />
            )}
          </Flex>
        )}

        <Flex
          className={`chat-message-box relative ${chat?.messageFrom === user?._id ? 'chat-your' : 'chat-them'}`}
          vertical
          align={`${chat?.attachmentData ? 'center' : 'flex-start'}`}
        >
          <Button
            className="rounded-full self-end"
            type="text"
            icon={<Icon icon="ic:round-reply" color="white" />}
            onClick={() =>
              handleReply(
                chat?._id,
                chat?.message,
                chat?.attachmentData,
                chat?.messageFrom,
              )
            }
          />

          {chat?.message ? (
            <ChatText
              messageFrom={chat?.messageFrom}
              message={chat?.message}
              searchTerm={searchChatPrefix}
            />
          ) : (
            <div className="mb-6">
              {(
                mime.lookup(chat?.attachmentName) || 'application/octet-stream'
              ).startsWith('image/') ? (
                <Image
                  className="chat-image"
                  src={chat?.attachmentData}
                  width={400}
                />
              ) : (
                <AudioPlayer src={chat?.attachmentData} />
              )}
            </div>
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

          <Flex
            className={`
            reaction-box 
            ${!chat?.reaction && 'hidden'} 
            ${chat?.messageFrom === user?._id ? '-left-2' : '-right-2'}`}
          >
            <Icon icon={chat?.reaction} width={16} height={16} />
          </Flex>
        </Flex>
      </Flex>
    </Tooltip>
  );
};

export default ChatMessageBox;
