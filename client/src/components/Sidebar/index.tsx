import React, { useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { googleLogout } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';

import { Layout, Flex, Avatar, Button, Dropdown, MenuProps } from 'antd';
import { Icon } from '@iconify/react';

import SearchBox from '@components/SearchBox';
import RecentChats from '@components/RecentChats';
import { AppDispatch, RootState } from '@src/store';
import { useLogout } from '@hooks/user.hooks';
import { useViewProfile } from '@hooks/profile.hooks';
import socket from '@src/sockets';
import { IUser } from '@interfaces/user.interface.ts';
import { setUser } from '@store/user.slice.ts';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router: NextRouter = useRouter();
  const { setModal } = useViewProfile();
  const { user } = useSelector((state: RootState) => state.user);
  const { refetch } = useLogout();

  const logout = async () => {
    googleLogout();
    await refetch();
    socket.emit('unregister', user?._id);
    await router.replace('/auth');
  };

  const viewProfile = () => {
    if (user) setModal('Edit Profile', user);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          className="glass-btn close-chat-btn"
          icon={<Icon icon="iconamoon:profile-fill" width={20} height={20} />}
          onClick={() => viewProfile()}
        >
          Profile
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const handleProfileChange = (user: IUser) => {
      dispatch(setUser(user));
    };

    socket.on('update-profile', handleProfileChange);

    return () => {
      socket.off('update-profile', handleProfileChange);
    };
  }, [dispatch]);

  return (
    <Sider className="chat-sidebar" width={300}>
      <Flex vertical align="center">
        <Flex className="avatar-box" justify="space-between" align="center">
          <Dropdown
            overlayClassName="chat-menu"
            className="chat-menu-box"
            menu={{ items: menuItems }}
            arrow={true}
            placement="bottomLeft"
            trigger={['click']}
          >
            <Avatar
              className="cursor-pointer"
              size="large"
              src={user?.googlePicture}
              draggable={false}
            />
          </Dropdown>

          <Button
            className="glass-btn"
            type="default"
            size="large"
            icon={<Icon icon="line-md:logout" />}
            onClick={logout}
          >
            Logout
          </Button>
        </Flex>

        <SearchBox />

        <RecentChats />
      </Flex>
    </Sider>
  );
};

export default Sidebar;
