import React from 'react';
import { Typography } from 'antd';

type Props = {
  text: string;
};

const { Paragraph } = Typography;

const TruncatedText: React.FC<Props> = (props) => {
  const { text } = props;
  const truncatedText: string =
    text.length > 27 ? text.slice(0, 23) + '...' : text;

  return <Paragraph>{truncatedText}</Paragraph>;
};

export default TruncatedText;
