import React from 'react';
import { Typography } from 'antd';

type Props = {
  text: string;
  length?: number;
};

const { Paragraph } = Typography;

const TruncatedText: React.FC<Props> = (props) => {
  const { text, length = 20 } = props;
  if (!text) return <Paragraph>{text}</Paragraph>;

  const truncatedText: string =
    text.length > length + 3 ? text.slice(0, length) + '...' : text;

  return <Paragraph>{truncatedText}</Paragraph>;
};

export default TruncatedText;
