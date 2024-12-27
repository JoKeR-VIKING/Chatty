import React, { useState, useRef, useEffect } from 'react';
import { Input, Tooltip, Flex, Spin } from 'antd';
import debounce from 'lodash.debounce';

import { IUser } from '@interfaces/user.interface';
import SearchResults from '@components/SearchResults';
import { useToast } from '@hooks/toast.hooks';
import { useSearchUsers } from '@hooks/user.hooks';

const SearchBox: React.FC = () => {
  const { createToast } = useToast();

  const searchListRef = useRef<HTMLDivElement>(null);
  const [searchListOpen, setSearchListOpen] = useState(false);
  const [searchPrefix, setSearchPrefix] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { isPending, isSuccess, data, error } = useSearchUsers(searchPrefix);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchListRef.current &&
      !searchListRef.current.contains(event.target as Node)
    ) {
      setSearchListOpen(false);
    }
  };

  const handleSearch = debounce(async (searchPrefix: string) => {
    if (searchPrefix.length <= 3) {
      setSearchPrefix(searchPrefix);
      setSearchResults([]);
      return;
    }

    setIsTyping(false);
    setSearchPrefix(searchPrefix);
    setSearchListOpen(true);
  }, 500);

  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        setSearchResults(data?.data?.users);
      } else {
        createToast('error', error?.message);
        setSearchResults([]);
      }
    }
  }, [createToast, isPending, isSuccess, data, error]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Flex className="w-full" ref={searchListRef} justify="center">
      <Tooltip
        className="friends-tooltip"
        overlayInnerStyle={{ boxShadow: 'none' }}
        title={
          (isPending || isTyping) && searchPrefix.length > 3 ? (
            <Spin size="default" />
          ) : (
            <SearchResults results={searchResults} />
          )
        }
        open={searchListOpen}
        getPopupContainer={(triggerNode) =>
          triggerNode?.parentElement || document.body
        }
        placement="bottom"
      >
        <Input
          className="search-box sidebar-search"
          size="middle"
          placeholder="Search your chatters"
          onChange={(e) => {
            setIsTyping(true);
            return handleSearch(e.target.value);
          }}
          onFocus={() => setSearchListOpen(true)}
        />
      </Tooltip>
    </Flex>
  );
};

export default SearchBox;
