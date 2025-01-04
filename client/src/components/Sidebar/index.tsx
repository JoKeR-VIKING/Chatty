import React from 'react';
import { useRouter, NextRouter } from 'next/router';
import { googleLogout } from '@react-oauth/google';
import { useSelector } from 'react-redux';

import { Layout, Flex, Avatar, Button } from 'antd';
import { Icon } from '@iconify/react';

import SearchBox from '@components/SearchBox';
import RecentChats from '@components/RecentChats';
import { RootState } from '@src/store';
import { useLogout } from '@hooks/user.hooks';
import socket from '@src/sockets';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const router: NextRouter = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { refetch } = useLogout();

  const logout = async () => {
    googleLogout();
    await refetch();
    socket.emit('unregister', user?._id);
    await router.replace('/auth');
  };

  return (
    <Sider className="chat-sidebar" width={300}>
      <Flex vertical align="center">
        <Flex className="avatar-box" justify="space-between" align="center">
          <Avatar
            className="cursor-pointer"
            size="large"
            src={user?.googlePicture}
            draggable={false}
            onClick={() => console.log('Avatar clicked')}
          />

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
