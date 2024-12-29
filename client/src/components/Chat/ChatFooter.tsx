import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  Layout,
  Input,
  Button,
  InputRef,
  UploadFile,
  Flex,
  Typography,
} from 'antd';
import { Icon } from '@iconify/react';

import { RootState } from '@src/store';
import EmojiPicker from '@components/EmojiPicker';
import Upload from '@components/Upload';
import AudioRecorder from '@components/AudioRecorder';
import { getFileIconName } from '@utils/helpers';

const { Footer } = Layout;
const { Paragraph } = Typography;

const ChatFooter: React.FC = () => {
  const { conversationId } = useSelector((state: RootState) => state.chat);

  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const messageRef = useRef<InputRef>(null);

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
        <Input
          ref={messageRef}
          className="message-box"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}

      <Upload fileList={fileList} setFileList={setFileList} />

      {message || fileList.length > 0 ? (
        <Button className="icon-btn" type="default" size="large" shape="circle">
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
