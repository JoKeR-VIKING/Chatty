import React from 'react';
import { Layout, Flex, Avatar, Button } from 'antd';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import { RootState } from '@src/store';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Sider
      className="chat-sidebar"
      width={300}
      style={{
        insetInlineStart: 0,
        scrollbarWidth: 'none',
        scrollbarGutter: 'stable',
      }}
    >
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
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </Sider>
  );
};

export default Sidebar;
