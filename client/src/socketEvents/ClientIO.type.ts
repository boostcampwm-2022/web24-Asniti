import type { SOCKET_EVENTS } from '@/socketEvents/index';
import type { Chat } from '@apis/chat';
import type { UserUID } from '@apis/user';

/* ↓ ↓ ↓ ↓ ↓ Sender ↓ ↓ ↓ ↓ ↓ */

export const CHAT_MUTATION_TYPE = {
  NEW: 'new',
  EDIT: 'modify',
  REMOVE: 'delete',
} as const;

export interface JoinChannelsPayload {
  channels: string[];
}

export interface SendChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.NEW;
  channelId: string;
  content: string;
}

export interface EditChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.EDIT;
  channelId: string;
  chatId: number;
  content: string;
}

export interface RemoveChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.REMOVE;
  channelId: string;
  chatId: number;
}

export interface InviteUserToChannelPayload {
  communityId: string;
  channelId: string;
  users: UserUID[];
}

export interface SocketChatInfo extends Chat {
  channelId: string;
  communityId: string;
}

export type ChatMutationEmitCallbackParameter =
  | { written: true; chatInfo: SocketChatInfo }
  | { written: false; chatInfo: undefined };

export type ChatMutationEmitCallback = (
  param: ChatMutationEmitCallbackParameter,
) => void;

/* ↑ ↑ ↑ ↑ ↑ Sender ↑ ↑ ↑ ↑ ↑ */

/* ↓ ↓ ↓ ↓ ↓ Receiver ↓ ↓ ↓ ↓ ↓ */

export interface ReceiveChatPayload extends Chat {
  channelId: string;
  communityId: string;
}

export type ReceiveNewChatListener = (payload: ReceiveChatPayload) => void;
export type ReceiveEditedChatListener = (payload: ReceiveChatPayload) => void;
export type ReceiveRemovedChatListener = (payload: ReceiveChatPayload) => void; // TODO: 삭제 Payload는 달라질 듯?
export type InvitedToChannelListener = (
  payload: InviteUserToChannelPayload,
) => void;
export type ConnectErrorListener = () => void;

export interface ServerToClientEventListener {
  [SOCKET_EVENTS.RECEIVE_CHAT]: ReceiveNewChatListener;
  [SOCKET_EVENTS.RECEIVE_EDIT_CHAT]: ReceiveEditedChatListener;
  [SOCKET_EVENTS.RECEIVE_REMOVE_CHAT]: ReceiveRemovedChatListener;
  [SOCKET_EVENTS.INVITED_TO_CHANNEL]: InvitedToChannelListener;
  [SOCKET_EVENTS.INVALID_TOKEN]: ConnectErrorListener;
}

/* ↑ ↑ ↑ ↑ ↑ Receiver ↑ ↑ ↑ ↑ ↑ */
