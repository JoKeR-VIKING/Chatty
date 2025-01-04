import React, { useState, ChangeEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Button, Flex, Input, Modal, Upload, Typography } from 'antd';
import { Icon } from '@iconify/react';

import { IUser } from '@interfaces/user.interface';
import { RootState } from '@src/store';
import { ProfileContext } from '@hooks/profile.hooks';
import { useUpdateUserDetails } from '@hooks/user.hooks';
import { useToast } from '@hooks/toast.hooks';

export type ProfileProps = {
  setModal: (modalTitle: string, user: IUser) => void;
  closeModal: () => void;
};

type Props = {
  children: React.ReactNode;
};

const { Paragraph } = Typography;

const ProfileProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const { createToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);

  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>();
  const [profileImage, setProfileImage] = useState<string>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const setModal = (modalTitle: string, profileUser: IUser) => {
    setModalTitle(modalTitle);
    setProfileName(profileUser?.googleName);
    setProfileImage(profileUser?.googlePicture);
    setIsDisabled(profileUser?._id !== user?._id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalTitle('');
    setModalOpen(false);
  };

  const handleProfileImageChange = (info: any) => {
    const file = info.file;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleProfileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value);
  };

  const { isPending, mutate } = useUpdateUserDetails();

  const handleSaveProfile = () => {
    if (!profileName || !profileImage) {
      createToast('error', 'Insufficient information');
      return;
    }

    mutate({ profileName, profileImage });
  };

  useEffect(() => {
    if (!isPending) closeModal();
  }, [isPending]);

  const footer = [
    <Button key="cancel" type="default" onClick={closeModal}>
      Cancel
    </Button>,
    <Button key="save" type="primary" onClick={handleSaveProfile}>
      Save
    </Button>,
  ];

  return (
    <ProfileContext.Provider value={{ setModal, closeModal }}>
      <Modal
        title={modalTitle}
        open={modalOpen}
        onCancel={closeModal}
        footer={!isDisabled && footer}
        centered
      >
        <Flex
          className="profile-box"
          vertical
          justify="space-around"
          align="center"
        >
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleProfileImageChange}
            accept="image/*"
            disabled={isDisabled}
          >
            {profileImage ? (
              <img
                className="profile-box-image"
                src={profileImage}
                alt="avatar"
              />
            ) : (
              <Button className="profile-box-upload-btn" type="text">
                <Icon icon="ic:round-plus" width={16} height={16} />
                <Paragraph>Upload</Paragraph>
              </Button>
            )}
          </Upload>
          <Input
            className="profile-box-name"
            value={profileName}
            onChange={handleProfileNameChange}
            disabled={isDisabled}
          />
        </Flex>
      </Modal>

      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
