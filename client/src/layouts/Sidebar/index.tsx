import UserProfile from '@components/UserProfile';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import CommunityNav from '@layouts/CommunityNav';
import DmNav from '@layouts/DmNav';
import React from 'react';
import { useLocation } from 'react-router-dom';
import useMyInfoQuery from 'src/hooks/useMyInfoQuery';

const Sidebar = () => {
  const { pathname } = useLocation();
  const myInfoQuery = useMyInfoQuery();

  return (
    <div className="flex flex-col min-w-[320px] w-[320px] h-full bg-background border-r border-line">
      <div className="flex-1">
        {pathname.startsWith('/dms') ? <DmNav /> : <CommunityNav />}
      </div>
      <div className="flex justify-between items-center w-full px-4 bg-inputBackground border-t border-line">
        {myInfoQuery.isLoading ? (
          'loading'
        ) : (
          <UserProfile user={myInfoQuery.data.result.user} />
        )}
        <button>
          <span className="sr-only">환경 설정</span>
          <Cog6ToothIcon className="w-7 h-7 fill-label" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
