import Avatar from '@components/Avatar';
import GnbItemContainer from '@components/GnbItemContainer';
import { LOGO_IMG_URL } from '@constants/url';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useCommunitiesQuery } from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import React, { memo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Gnb = () => {
  const { pathname } = useLocation();
  const params = useParams();

  const openCreateCommunityModal = useRootStore(
    (state) => state.openCreateCommunityModal,
  );
  const communitiesQuery = useCommunitiesQuery();

  return (
    <div className="flex min-w-[80px] w-[80px] h-full bg-background border-r border-line z-[100px]">
      <div className="flex flex-col justify-start items-center w-full pt-[16px] overflow-auto no-display-scrollbar pb-[30vh]">
        <div className="w-full">
          <GnbItemContainer isActive={pathname === '/dms'}>
            <Link to="/dms">
              <Avatar
                name="Direct Message"
                size="small"
                url={LOGO_IMG_URL}
                variant="rectangle"
              />
            </Link>
          </GnbItemContainer>
        </div>

        <div className="w-[70%] h-[2px] bg-line mb-[10px]" />

        <ul className="w-full">
          {communitiesQuery.isLoading ? (
            <div>로딩중</div>
          ) : (
            communitiesQuery.data?.map(({ _id, name, profileUrl }) => (
              <GnbItemContainer
                key={_id}
                isActive={params?.communityId === _id}
              >
                <Link to={`/communities/${_id}`}>
                  <Avatar
                    name={name}
                    size="small"
                    variant="rectangle"
                    url={profileUrl}
                  />
                </Link>
              </GnbItemContainer>
            ))
          )}
        </ul>

        <button type="button" onClick={openCreateCommunityModal}>
          <span className="sr-only">커뮤니티 추가</span>
          <Avatar
            name="커뮤니티 추가"
            size="small"
            variant="circle"
            className="transition-all hover:bg-primary hover:border-primary hover:text-offWhite"
          >
            <PlusIcon className="w-6 h-6" />
          </Avatar>
        </button>
      </div>
    </div>
  );
};

export default memo(Gnb);
