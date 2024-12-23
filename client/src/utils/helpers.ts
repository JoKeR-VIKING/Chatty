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
