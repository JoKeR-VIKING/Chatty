import React, { useState, useRef, useEffect } from 'react';
import ReactHowler from 'react-howler';

import { Flex, Button, Slider, SliderSingleProps, Typography } from 'antd';
import { Icon } from '@iconify/react';
import { formatTime } from '@utils/helpers.ts';

type Props = {
  src: string;
};

const { Paragraph } = Typography;

const AudioPlayer: React.FC<Props> = (props) => {
  const { src } = props;

  const [playing, setPlaying] = useState(false);
  const [currSeconds, setCurrSeconds] = useState(0);
  const [duration, setDuration] = useState(0.0);
  const playerRef = useRef<ReactHowler>(null);

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
    value,
  ) => formatTime(Math.trunc(value || 0));

  const handleLoad = () => {
    if (!playerRef.current) return;

    setDuration(playerRef.current?.duration());
  };

  const handleEnd = () => {
    setPlaying(false);
    setCurrSeconds(0.0);
  };

  useEffect(() => {
    let interval = null;

    if (playing) {
      interval = setInterval(() => {
        setCurrSeconds(playerRef.current?.seek() || 0.0);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing]);

  return (
    <Flex className="audio-player-main" justify="space-around" align="center">
      <ReactHowler
        ref={playerRef}
        src={src}
        playing={playing}
        onLoad={handleLoad}
        onEnd={handleEnd}
      />
      <Button
        className="audio-player-button"
        type="default"
        icon={<Icon icon={playing ? 'solar:pause-bold' : 'solar:play-bold'} />}
        onClick={() => setPlaying(!playing)}
      />
      <Paragraph className="audio-player-timer">
        {formatTime(Math.trunc(currSeconds))}
      </Paragraph>
      <Slider
        className="audio-player-range"
        min={0}
        max={duration}
        step={0.01}
        tooltip={{ formatter }}
        value={currSeconds}
        onChange={(curr: number) => {
          setCurrSeconds(curr);
          playerRef?.current?.seek(curr);
        }}
      />
    </Flex>
  );
};

export default AudioPlayer;
