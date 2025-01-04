import React from 'react';

import { Flex, Button } from 'antd';
import { Icon } from '@iconify/react';

import { IApiResponse } from '@src/interfaces';
import { useAddReaction } from '@hooks/chat.hooks';
import { useToast } from '@hooks/toast.hooks';
import { AxiosError } from 'axios';

const reactionEmojis: string[] = [
  'fluent-emoji:thumbs-up-light',
  'fluent-emoji:red-heart',
  'fluent-emoji:face-with-tears-of-joy',
  'fluent-emoji:beaming-face-with-smiling-eyes',
  'fluent-emoji:slightly-frowning-face',
];

type Props = {
  chatId: string;
  chatReaction: string;
};

const ReactionBar: React.FC<Props> = (props) => {
  const { chatId, chatReaction } = props;

  const { createToast } = useToast();

  const onError = (error: AxiosError<IApiResponse>) => {
    createToast('error', error.message);
  };

  const { mutate } = useAddReaction({ onError });

  const handleReaction = (reaction: string) => {
    mutate({ chatId, reaction: chatReaction === reaction ? '' : reaction });
  };

  return (
    <Flex className="reaction-bar">
      {reactionEmojis?.map((emoji) => (
        <Button
          key={emoji}
          className={emoji === chatReaction ? 'selected-reaction' : ''}
          type="text"
          icon={<Icon icon={emoji} width={25} height={25} />}
          onClick={() => handleReaction(emoji)}
        />
      ))}
    </Flex>
  );
};

export default ReactionBar;
