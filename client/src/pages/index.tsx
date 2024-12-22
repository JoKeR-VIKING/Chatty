import { useAuthCheck } from '@hooks/auth.hooks.ts';

const Index = () => {
  useAuthCheck();
};

export default Index;
