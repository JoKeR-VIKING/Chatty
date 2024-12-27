import React, {
  Dispatch,
  SetStateAction,
  RefObject,
  useState,
  useRef,
  useEffect,
} from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { Button, InputRef, Tooltip } from 'antd';
import { Icon } from '@iconify/react';

type Props = {
  disabled: boolean;
  setMessage?: Dispatch<SetStateAction<string>>;
  messageRef?: RefObject<InputRef>;
  keepOpen?: boolean;
};

const EmojiPicker: React.FC<Props> = (props) => {
  const { disabled, setMessage, messageRef, keepOpen = true } = props;

  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setEmojiOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={emojiPickerRef}>
      <Tooltip
        color="transparent"
        overlayInnerStyle={{ boxShadow: 'none' }}
        title={
          <Picker
            theme="light"
            autoFocus
            previewPosition="none"
            data={data}
            onEmojiSelect={(e: any) => {
              if (setMessage) setMessage((prev) => prev + e?.native);
              if (!keepOpen) setEmojiOpen(false);
              if (messageRef) messageRef.current?.focus();
            }}
          />
        }
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
          disabled={disabled}
          onClick={() => {
            setEmojiOpen(!emojiOpen);
            if (emojiOpen && messageRef) messageRef.current?.focus();
          }}
        >
          <Icon className="icon" icon="mdi:emoji" width="30px" height="30px" />
        </Button>
      </Tooltip>
    </div>
  );
};

export default EmojiPicker;
