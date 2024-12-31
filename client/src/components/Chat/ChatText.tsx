import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from 'antd';

import { RootState } from '@src/store';

const { Paragraph } = Typography;

type Props = {
  message: string;
  messageFrom: string;
  searchTerm: string;
};

const ChatText: React.FC<Props> = (props) => {
  const { message, messageFrom, searchTerm } = props;

  const { user } = useSelector((state: RootState) => state.user);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span
          key={index}
          style={{ backgroundColor: 'white', color: 'darkcyan' }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <Paragraph
      className={`chat-message ${messageFrom === user?._id && 'mb-3'}`}
    >
      {highlightText(message, searchTerm)}
    </Paragraph>
  );
};

export default ChatText;
