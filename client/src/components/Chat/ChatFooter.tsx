import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Tooltip,
  Input,
  Button,
  InputRef,
  Upload,
  UploadFile,
  Flex,
  Typography,
} from 'antd';
import { Icon } from '@iconify/react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import AudioIcon from '@components/AudioIcon';
import { getFileIconName } from '@utils/helpers';

const { Footer } = Layout;
const { Paragraph } = Typography;

const ChatFooter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [recordingStart, setRecordingStart] = useState(false);
  const [time, setTime] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<InputRef>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const emojiPicker = (
    <Picker
      theme="light"
      autoFocus
      previewPosition="none"
      data={data}
      onEmojiSelect={(e: any) => {
        setMessage(message + e?.native);
        setEmojiOpen(false);
        messageRef.current?.focus();
      }}
    />
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setEmojiOpen(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      setTime(0);
      const timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File(
          [audioBlob],
          `AUD-${Date.now().toString()}.wav`,
          { type: 'audio/wav' },
        );
        const audioUploadFile: UploadFile = {
          uid: Date.now().toString(),
          name: `AUD-${Date.now().toString()}.wav`,
          url: URL.createObjectURL(audioFile),
        };
        setFileList([audioUploadFile]);
        clearInterval(timerInterval);
      };

      mediaRecorder.start();
      setRecordingStart(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingStart(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Footer className="chat-footer">
      <div ref={emojiPickerRef}>
        <Tooltip
          color="transparent"
          overlayInnerStyle={{ boxShadow: 'none' }}
          title={emojiPicker}
          open={emojiOpen}
          getPopupContainer={(triggerNode) =>
            triggerNode?.parentElement || document.body
          }
        >
          <Button
            className="icon-btn w-10 h-10"
            type="text"
            size="large"
            shape="circle"
            disabled={fileList?.length > 0}
            onClick={() => {
              setEmojiOpen(!emojiOpen);
              if (emojiOpen) messageRef.current?.focus();
            }}
          >
            <Icon
              className="icon"
              icon="mdi:emoji-outline"
              width="30px"
              height="30px"
            />
          </Button>
        </Tooltip>
      </div>

      {fileList?.length > 0 ? (
        <Flex
          justify="flex-start"
          align="center"
          className="w-full rounded-2xl border border-dashed ml-5 mr-5 pl-2 pt-2.5 pb-2.5"
        >
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
          className="rounded-2xl font-thin text-[1rem] ml-5 mr-5 pt-2.5 pb-2.5"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}

      <Upload
        fileList={fileList}
        multiple={false}
        showUploadList={false}
        beforeUpload={(file) => setFileList([file])}
      >
        <Button
          className="mr-3 icon-btn"
          type="default"
          size="large"
          shape="circle"
        >
          <Icon
            className="icon"
            icon="gridicons:attachment"
            width="20px"
            height="20px"
          />
        </Button>
      </Upload>

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
        <Button
          className="icon-btn"
          type="default"
          size="large"
          shape={recordingStart ? 'default' : 'circle'}
          onClick={async () => {
            setRecordingStart(!recordingStart);
            if (!recordingStart) await startRecording();
            else stopRecording();
          }}
        >
          {!recordingStart ? (
            <Icon
              className="icon"
              icon={'mynaui:microphone-solid'}
              width="20px"
              height="20px"
            />
          ) : (
            <AudioIcon />
          )}
          {recordingStart ? formatTime(time) : <div className="hidden"></div>}
        </Button>
      )}
    </Footer>
  );
};

export default ChatFooter;
