import { MutableRefObject } from 'react';

export const getFileIconName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return 'mynaui:image-solid';
    case 'pdf':
      return 'mingcute:pdf-fill';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
      return 'mynaui:video-solid';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'aac':
    case 'm4a':
      return 'lucide:file-audio-2';
    case 'zip':
    case 'tar':
    case 'tar.gz':
    case 'tgz':
    case 'rar':
    case '7z':
    case 'gz':
    case 'bz2':
    case 'xz':
      return 'mingcute:file-zip-fill';
    default:
      return 'mingcute:file-fill';
  }
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDateToTime = (dateStr: string) => {
  const date = new Date(dateStr);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: undefined,
  });
};

export const scrollToMessage = (
  messagesRef: MutableRefObject<Map<string, HTMLElement>>,
  id: string,
) => {
  const messageNode = messagesRef.current.get(id);
  if (messageNode) {
    messageNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    messageNode.classList.add('animate__animated');
    messageNode.classList.add('animate__flash');

    setTimeout(() => {
      messageNode.classList.remove('animate__animated');
      messageNode.classList.remove('animate__flash');
    }, 1000);
  }
};
