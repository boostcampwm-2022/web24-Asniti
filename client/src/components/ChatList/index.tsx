import type { GetChatsResult } from '@apis/chat';
import type { UsersMap } from '@hooks/user';
import type { FC } from 'react';

import ChatItem from '@components/ChatItem';
import {
  useSetUnreadChatIdQueryData,
  useUnreadChatIdQueryData,
} from '@hooks/chat';
import useIntersectionObservable from '@hooks/useIntersectionObservable';
import React, { useEffect, useRef, Fragment } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  pages: GetChatsResult[];
  users: UsersMap;
  communityManagerId?: string;
  channelManagerId?: string;
}

const ChatList: FC<Props> = ({
  pages,
  users,
  communityManagerId,
  channelManagerId,
}) => {
  const params = useParams();
  const channelId = params.roomId as string;

  // 캐시에 있는 안 읽은 메시지의 id를 -1로 초기화하는 커스텀 훅
  const { clearUnreadChatIdQueryData } = useSetUnreadChatIdQueryData(channelId);
  const firstUnreadChatObservable = useIntersectionObservable(
    // 안 읽은 메시지를 렌더링하는 `<ChatItem />`위의 divider가 화면에 보이면
    // 캐시에 있는 안 읽은 메시지의 id를 -1로 초기화한다.
    (entry, observer) => {
      observer.unobserve(entry.target);
      clearUnreadChatIdQueryData();
    },
  );

  // 캐시에 있는 안 읽은 메시지의 id를 가져온다.
  const cachedUnreadChatId = useUnreadChatIdQueryData(channelId) as number;
  // 채널 입장 시의 안 읽은 메시지의 id를 저장한다.
  const firstUnreadChatId = useRef<number | null>(null);

  useEffect(() => {
    // 이렇게 해야 divider가 화면에 보여서
    // clearUnreadChatIdQueryData()를 실행하여 캐시에 -1로 저장해도
    // firstUnreadChatId는 -1이 아니라 첫 렌더링 시의 안 읽은 메시지의 id를 저장하게 된다.
    if (!firstUnreadChatId.current) {
      firstUnreadChatId.current = cachedUnreadChatId;
    }
  }, []);

  return (
    <>
      {pages.map(
        (page) =>
          !!page.chat?.length && (
            <Fragment key={page.chat[0].id}>
              {page.chat.map((chat) => (
                <Fragment key={chat.id}>
                  {/* chat의 id가 첫 렌더링 시의 안 읽은 메시지의 id와 같다면 divider를 렌더링한다*/}
                  {chat.id === firstUnreadChatId.current && (
                    <div
                      className="flex items-center relative h-0 my-3 border-b-[1px] border-error"
                      ref={
                        /* 캐시에 저장된 안 읽은 메시지의 ㅑㅇ가 -1이 되면 divider에 더이상 
                        observable ref가 붙지 않도록 한다*/
                        chat.id === cachedUnreadChatId
                          ? firstUnreadChatObservable
                          : null
                      }
                    >
                      <span className="flex absolute rounded-xl px-1 right-0 bg-error text-s12 text-offWhite mr-1">
                        NEW
                      </span>
                    </div>
                  )}
                  <ChatItem
                    chat={chat}
                    className="px-5 py-3 tracking-tighter"
                    user={users[chat.senderId]}
                    communityManagerId={communityManagerId}
                    channelManagerId={channelManagerId}
                  />
                </Fragment>
              ))}
            </Fragment>
          ),
      )}
    </>
  );
};

export default ChatList;
