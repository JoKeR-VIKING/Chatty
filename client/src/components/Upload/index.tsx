import React from 'react';
import { Button, Upload as UploadFile } from 'antd';
import { Icon } from '@iconify/react';

import { useToast } from '@hooks/toast.hooks';

type Props = {
  fileList: any;
  setFileList: any;
};

const Upload: React.FC<Props> = (props) => {
  const { fileList, setFileList } = props;

  const { createToast } = useToast();

  return (
    <UploadFile
      fileList={fileList}
      multiple={false}
      showUploadList={false}
      beforeUpload={async (file) => {
        if (file.size > 1024 * 1024 * 3) {
          createToast('error', 'Maximum file size allowed is 3 MB');
          return;
        }

        setFileList([file]);
      }}
      accept="image/*"
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
    </UploadFile>
  );
};

export default Upload;
