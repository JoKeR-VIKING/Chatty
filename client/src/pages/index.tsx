import React, { useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';

import { Spin } from 'antd';

const Index: React.FC = () => {
  const router: NextRouter = useRouter();

  useEffect(() => {
    (async () => {
      await router.replace('/auth');
    })();
  }, []);

  return <Spin size="large" />;
};

export default Index;
