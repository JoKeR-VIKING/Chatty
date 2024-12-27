import React, { useState, useEffect } from 'react';

import { Flex, Menu, Avatar, Typography, Image } from 'antd';
import type { GetProp, MenuProps } from 'antd';

import { IUser } from '@interfaces/user.interface';
import NoResultsFoundImage from '@public/NoResultsFound.png';

type MenuItem = GetProp<MenuProps, 'items'>[number];

type Props = {
  results: IUser[];
};

const { Paragraph } = Typography;

const SearchResults: React.FC<Props> = (props) => {
  const { results } = props;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!results?.length) {
      setMenuItems([
        {
          key: 1,
          label: (
            <Flex justify="start" align="center">
              <Image
                height={40}
                preview={false}
                src={NoResultsFoundImage.src}
              />
              <Paragraph className="ml-2">Sorry, no results found!</Paragraph>
            </Flex>
          ),
          disabled: true,
          className: 'cursor-default',
        },
      ]);
      return;
    }

    const menuItems: MenuItem[] = results?.map(
      (user: IUser) =>
        ({
          key: user?.googleEmail,
          label: (
            <Flex className="friends-list-item" justify="start" align="center">
              <Avatar className="mr-4" src={user?.googlePicture} />
              <Paragraph>{user?.googleName}</Paragraph>
            </Flex>
          ),
        }) as MenuItem,
    );

    setMenuItems(menuItems);
  }, [results]);

  return (
    <Flex className="friends-search-box" justify="center" align="center">
      <Menu items={menuItems} />
    </Flex>
  );
};

export default SearchResults;
