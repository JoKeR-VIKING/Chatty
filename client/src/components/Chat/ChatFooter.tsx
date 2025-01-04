import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import { Layout, Button, Input, InputRef, Flex, Typography, Image } from 'antd';
import { Icon } from '@iconify/react';

import { AppDispatch, RootState } from '@src/store';
import { removeReplyChat } from '@store/chat.slice';
import { ICreateChatRequest } from '@interfaces/chat.interface';
import EmojiPicker from '@components/EmojiPicker';
import Upload from '@components/Upload';
import AudioRecorder from '@components/AudioRecorder';
import { useToast } from '@hooks/toast.hooks';
import {
  useSendMessage,
  useSendMessageWithAttachment,
} from '@hooks/chat.hooks';
import { getFileIconName } from '@utils/helpers';
import { IApiResponse } from '@src/interfaces';
import TruncatedText from '@components/TruncatedText';

const { Footer } = Layout;
const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const ChatFooter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedChatUser, conversationId, replyChat } = useSelector(
    (state: RootState) => state.chat,
  );

  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);
  const messageRef = useRef<InputRef>(null);
  const footerRef = useRef<HTMLElement>(null);

  const onSuccess = () => {
    setMessage('');
    setFileList([]);
  };

  const onError = (error: AxiosError<IApiResponse>) => {
    createToast('error', error?.response?.data?.message as string);
  };

  const { mutate: mutateSendMessage, isPending: messagePending } =
    useSendMessage({ onSuccess, onError });
  const {
    mutate: mutateSendMessageWithAttachment,
    isPending: attachmentPending,
  } = useSendMessageWithAttachment({ onSuccess, onError });

  const sendMessage = useCallback(() => {
    mutateSendMessage({
      messageFrom: user?._id,
      messageTo: selectedChatUser?._id,
      message: message,
      replyMessageId: replyChat?._id,
    } as ICreateChatRequest);

    dispatch(removeReplyChat());
  }, [
    message,
    mutateSendMessage,
    selectedChatUser?._id,
    user?._id,
    replyChat?._id,
    dispatch,
  ]);

  const sendMessageWithAttachment = useCallback(() => {
    const formData = new FormData();

    formData.append('messageFrom', user?._id as string);
    formData.append('messageTo', selectedChatUser?._id as string);
    formData.append('attachmentName', fileList[0]?.name);
    formData.append('attachmentData', fileList[0] as File);
    if (replyChat?._id) formData.append('replyMessageId', replyChat._id);

    mutateSendMessageWithAttachment(formData);
    dispatch(removeReplyChat());
  }, [
    fileList,
    mutateSendMessageWithAttachment,
    selectedChatUser?._id,
    user?._id,
    replyChat?._id,
    dispatch,
  ]);

  const handleCloseReply = () => {
    dispatch(removeReplyChat());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (fileList.length > 0) {
          sendMessageWithAttachment();
        } else if (message) {
          sendMessage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fileList.length, message, sendMessage, sendMessageWithAttachment]);

  if (!conversationId) {
    return <></>;
  }

  return (
    <Footer ref={footerRef} className="chat-footer">
      <EmojiPicker
        disabled={fileList?.length > 0}
        setMessage={setMessage}
        messageRef={messageRef}
      />

      {fileList?.length > 0 ? (
        <Flex vertical className="attachment-box-main">
          {replyChat?._id && (
            <Flex
              justify={replyChat?.attachmentData && 'center'}
              align="flex-start"
              vertical
              className="message-reply-main"
            >
              <Flex vertical>
                <Text className="message-reply-text">
                  {replyChat?.messageFrom === user?._id ? 'You' : ''}
                </Text>
                <TruncatedText text={replyChat?.message} length={120} />
              </Flex>

              {replyChat?.attachmentData && (
                <Image
                  src={replyChat?.attachmentData}
                  alt="attachment"
                  preview={false}
                  width={150}
                />
              )}

              <Button
                className="message-reply-close-btn"
                type="text"
                icon={
                  <Icon
                    icon="majesticons:close-line"
                    color="white"
                    width={16}
                    height={16}
                  />
                }
                onClick={handleCloseReply}
              />
            </Flex>
          )}

          <Flex justify="flex-start" align="center" className="attachment-box">
            <Icon
              className="icon"
              icon={getFileIconName(fileList[0]?.name)}
              width="25px"
              height="25px"
            />
            <Paragraph
              className="font-thin text-[1rem] text-white"
              style={{ margin: 0 }}
            >
              {fileList[0]?.name}
            </Paragraph>
            <Button
              className="ml-1"
              type="text"
              size="middle"
              shape="circle"
              danger
              onClick={() => setFileList([])}
            >
              <Icon icon="majesticons:close-line" width="25px" height="25px" />
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex vertical className="message-box-main">
          {replyChat?._id && (
            <Flex
              justify={replyChat?.attachmentData && 'center'}
              align="flex-start"
              vertical
              className="message-reply-main"
            >
              <Flex vertical>
                <Text className="message-reply-text">
                  {replyChat?.messageFrom === user?._id ? 'You' : ''}
                </Text>
                <TruncatedText text={replyChat?.message} length={120} />
              </Flex>

              {replyChat?.attachmentData && (
                <Image
                  src={replyChat?.attachmentData}
                  alt="attachment"
                  preview={false}
                  width={150}
                />
              )}

              <Button
                className="message-reply-close-btn"
                type="text"
                icon={
                  <Icon
                    icon="majesticons:close-line"
                    color="white"
                    width={16}
                    height={16}
                  />
                }
                onClick={handleCloseReply}
              />
            </Flex>
          )}

          <TextArea
            ref={messageRef}
            className="message-box"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 3 }}
          />
        </Flex>
      )}

      <Upload fileList={fileList} setFileList={setFileList} />

      {message || fileList.length > 0 ? (
        <Button
          className="icon-btn"
          type="default"
          size="large"
          shape="circle"
          onClick={fileList.length ? sendMessageWithAttachment : sendMessage}
          disabled={messagePending || attachmentPending}
        >
          <Icon
            className="icon"
            icon="mynaui:send-solid"
            width="20px"
            height="20px"
          />
        </Button>
      ) : (
        <AudioRecorder setFileList={setFileList} />
      )}
    </Footer>
  );
};

export default ChatFooter;
