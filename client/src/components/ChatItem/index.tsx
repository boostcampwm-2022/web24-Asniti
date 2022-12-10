import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC, MouseEventHandler } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
import ChatForm from '@components/ChatForm';
import ChatActions from '@components/ChatItem/ChatActions';
import { useSetChatsQueryData } from '@hooks/chat';
import useHover from '@hooks/useHover';
import { useSocketStore } from '@stores/socketStore';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React, { memo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { editChatPayload, SOCKET_EVENTS } from '@/socketEvents';

const getChatStatus = ({
  updatedAt,
  createdAt,
  deletedAt,
  written,
  type,
}: Chat) => {
  const isUpdated = updatedAt && updatedAt !== createdAt;
  const isDeleted = !!deletedAt;
  const isFailedToSendChat = written === false;
  const isSystemChat = type === 'SYSTEM';

  return { isUpdated, isDeleted, isFailedToSendChat, isSystemChat };
};

interface ChatItemHeadProps {
  chat: Chat;
  user: User;
  isHover: boolean;
  opacityClassnames: string;
  handleClickDiscardButton: () => void;
}

const ChatItemHead: FC<ChatItemHeadProps> = ({
  chat,
  user,
  isHover,
  opacityClassnames,
  handleClickDiscardButton,
}) => {
  const { createdAt } = chat;
  const { isUpdated, isDeleted, isFailedToSendChat, isSystemChat } =
    getChatStatus(chat);
  const failedChatControlButtonsClassnames = `flex items-center px-3 rounded`;

  return (
    <div className="flex gap-2 items-center text-s16 mb-2">
      <span
        className={`font-bold ${
          isSystemChat ? 'text-primary' : 'text-indigo'
        } ${opacityClassnames}`}
      >
        {user.nickname}
      </span>
      {isFailedToSendChat ? (
        <span className="text-error font-bold">전송 실패</span>
      ) : (
        <span className="text-placeholder">
          {dateStringToKRLocaleDateString(createdAt, {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      )}
      {isDeleted ? (
        <span className="text-label">(삭제됨)</span>
      ) : (
        isUpdated && <span className="text-label">(수정됨)</span>
      )}
      <div className="flex justify-end grow gap-2 text-s14">
        {isFailedToSendChat && isHover && (
          <button
            type="button"
            className={`${failedChatControlButtonsClassnames} bg-error hover:bg-error-dark text-offWhite`}
            onClick={handleClickDiscardButton}
          >
            지우기
          </button>
        )}
      </div>
    </div>
  );
};

const deletedUser: User = {
  _id: 'Deleted User',
  id: 'deletedUser@from.asnity',
  nickname: 'DeletedUser',
  profileUrl: '',
  status: 'OFFLINE',
  description: 'fakeUser',
  createdAt: new Date().toISOString(),
};

interface Props extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  chat: Chat;
  user?: User;
}

const ChatItem: FC<Props> = ({ className = '', chat, user = deletedUser }) => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { roomId, communityId } = useParams() as {
    roomId: string;
    communityId: string;
  };
  const socket = useSocketStore((state) => state.sockets[communityId]);
  const { content, written, id } = chat;
  const { isDeleted, isFailedToSendChat } = getChatStatus(chat);
  const { isHover, ...hoverHandlers } = useHover(false);
  const {
    removeChatQueryData,
    editChatQueryData,
    updateEditChatToWrittenChat,
    updateEditChatToFailedChat,
  } = useSetChatsQueryData();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isPending = written === -1;

  const opacityClassnames = cn({
    'opacity-40': isPending || isFailedToSendChat,
  });

  const handleClickDiscardButton = () => {
    removeChatQueryData({ channelId: roomId, id });
  };

  const handleClickCopyButton: MouseEventHandler<HTMLButtonElement> = () => {
    if (!chatContentRef.current) return;

    const $$p = chatContentRef.current?.querySelectorAll('p');
    const chunks = [] as string[];

    if ($$p) {
      $$p.forEach(($p) => {
        chunks.push($p.textContent || '');
      });
    }

    window.navigator.clipboard.writeText(chunks.join('\n')).then(() => {
      toast.success('클립보드에 복사 완료!', { position: 'bottom-right' });
    });
  };

  const handleClickEditButton: MouseEventHandler<HTMLButtonElement> = () => {
    setIsEditing(true);
  };

  const handleSubmitChatEditForm = (editedContent: string) => {
    const editedChatInfo = {
      id,
      content: editedContent,
      channelId: roomId,
    };

    editChatQueryData(editedChatInfo);
    setIsEditing(false);

    socket.emit(
      SOCKET_EVENTS.EDIT_CHAT,
      editChatPayload(editedChatInfo),
      ({
        written: _written,
        chat: _updatedChat,
      }: {
        written: boolean;
        chat: Chat;
      }) => {
        if (_written) {
          updateEditChatToWrittenChat({
            updatedChat: _updatedChat,
            channelId: roomId,
          });
          return;
        }
        updateEditChatToFailedChat({ id, channelId: roomId, content });
        toast.error('채팅 수정에 실패했습니다.');
      },
    );

    const fail = false;

    setTimeout(() => {
      if (fail) {
        updateEditChatToFailedChat({ id, channelId: roomId, content });
        toast.error('채팅 수정에 실패했습니다.');
      } else {
        updateEditChatToWrittenChat({
          updatedChat: { ...chat, ...editedChatInfo },
          channelId: roomId,
        });
      }
    }, 1000);
  };

  return (
    chat && (
      <li className={`relative ${className}`} {...hoverHandlers}>
        <div className="flex gap-3">
          <div className="pt-1">
            <Avatar
              variant="rectangle"
              size="sm"
              profileUrl={user.profileUrl}
              name={user.nickname}
            />
          </div>
          <div className="grow">
            <ChatItemHead
              chat={chat}
              isHover={isHover}
              handleClickDiscardButton={handleClickDiscardButton}
              opacityClassnames={opacityClassnames}
              user={user}
            />
            <div className={`${opacityClassnames}`} ref={chatContentRef}>
              {isDeleted ? (
                <p className="opacity-50">삭제된 채팅입니다.</p>
              ) : isEditing ? (
                <ChatForm
                  editMode
                  initialValue={content}
                  ref={textareaRef}
                  handleSubmitChat={handleSubmitChatEditForm}
                />
              ) : (
                <ChatContent content={content} />
              )}
            </div>
          </div>
          <div className="absolute -top-3 right-3">
            {!isEditing && !isPending && isHover && (
              <ChatActions.Container className="bg-background">
                <ChatActions.Copy onClick={handleClickCopyButton} />
                <ChatActions.Edit onClick={handleClickEditButton} />
                <ChatActions.Remove />
              </ChatActions.Container>
            )}
          </div>
        </div>
      </li>
    )
  );
};

export default memo(ChatItem);
