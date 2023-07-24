import { useEffect } from 'react';
import useRequest from '../hooks/use-request';
import Search from '../components/search';
export default () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <Search />
    </div>
  );
};
