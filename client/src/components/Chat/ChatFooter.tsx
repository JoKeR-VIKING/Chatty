import React, { useState, useRef, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';

import { Layout, Button, Input, InputRef, Flex, Typography } from 'antd';
import { Icon } from '@iconify/react';

import { RootState } from '@src/store';
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

const { Footer } = Layout;
const { Paragraph } = Typography;
const { TextArea } = Input;

const ChatFooter: React.FC = () => {
  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedChatUser, conversationId } = useSelector(
    (state: RootState) => state.chat,
  );

  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);
  const messageRef = useRef<InputRef>(null);

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

  const sendMessage = () => {
    mutateSendMessage({
      messageFrom: user?._id,
      messageTo: selectedChatUser?._id,
      message: message,
    } as ICreateChatRequest);
  };

  const sendMessageWithAttachment = () => {
    const formData = new FormData();

    formData.append('messageFrom', user?._id as string);
    formData.append('messageTo', selectedChatUser?._id as string);
    formData.append('attachmentName', fileList[0]?.name);
    formData.append('attachmentData', fileList[0] as File);

    mutateSendMessageWithAttachment(formData);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (fileList.length > 0) {
        sendMessageWithAttachment();
      } else {
        sendMessage();
      }
    }
  };

  if (!conversationId) {
    return <></>;
  }

  return (
    <Footer className="chat-footer">
      <EmojiPicker
        disabled={fileList?.length > 0}
        setMessage={setMessage}
        messageRef={messageRef}
      />

      {fileList?.length > 0 ? (
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
      ) : (
        <TextArea
          ref={messageRef}
          className="message-box"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
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
