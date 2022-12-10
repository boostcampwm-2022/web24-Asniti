export const storeMessageURL = (channelId) => `/api/channels/${channelId}/message`;
export const joinChannelInUsersURL = (channelId) => `/api/channels/${channelId}/users`;
export const modifyOrDeleteMessageURL = (channelId, messageId) =>
  `api/channels/${channelId}/message/${messageId}`;

export const getMessageRequestURL = (data) => {
  if (data.type == 'new') return storeMessageURL(data.channelId);
  else if (data.type == 'modify' || data.type == 'delete')
    return modifyOrDeleteMessageURL(data.channelId, data.messageId);
  else throw Error('Unknown Message Request Type');
};
