import React, { useRef, useState, Dispatch, SetStateAction } from 'react';

import { Button } from 'antd';
import { Icon } from '@iconify/react';

import AudioIcon from '@components/AudioIcon';
import { formatTime } from '@utils/helpers';

type Props = {
  setFileList: Dispatch<SetStateAction<File[]>>;
};

const AudioRecorder: React.FC<Props> = (props) => {
  const { setFileList } = props;

  const [recordingStart, setRecordingStart] = useState(false);
  const [time, setTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        setFileList([audioFile]);
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

  return (
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
  );
};

export default AudioRecorder;
