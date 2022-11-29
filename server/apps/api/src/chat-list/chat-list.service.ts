import { Injectable } from '@nestjs/common';
import { GetMessageDto, RestoreMessageDto } from '@chat-list/dto';
import { ChannelRepository } from '@repository/channel.repository';
import { ChatListRespository } from '@repository/chat-list.respository';

@Injectable()
export class ChatListService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatListRespository: ChatListRespository,
  ) {}
  async restoreMessage(restoreMessageDto: RestoreMessageDto) {
    const { channel_id } = restoreMessageDto;

    const channel = await this.channelRepository.findById(channel_id);

    if (channel.chatLists.length === 0) {
      // chatList가 없는 경우 새로 생성
      const newChatList = await this.chatListRespository.create({
        chat: [this.makeChat(0, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
      return;
    }

    const chatLists = await this.chatListRespository.findById(channel.chatLists.at(-1));
    const chatNum = (channel.chatLists.length - 1) * 100 + chatLists.chat.length;

    if (chatNum % 100 === 0) {
      // chatList가 꽉 찼을 때
      const newChatList = await this.chatListRespository.create({
        chat: [this.makeChat(chatNum, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
    } else {
      await this.chatListRespository.addArrAtArr({ _id: chatLists._id }, 'chat', [
        this.makeChat(chatNum, restoreMessageDto),
      ]);
      if (chatNum % 100 === 99) {
        await this.chatListRespository.updateOne(
          { _id: chatLists._id },
          { lastChatTime: new Date() },
        );
      }
    }
  }

  makeChat(chatNum, restoreMessageDto) {
    return {
      id: chatNum,
      type: restoreMessageDto.type,
      content: restoreMessageDto.content,
      senderId: restoreMessageDto.senderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getMessage(getMessageDto: GetMessageDto) {
    const { prev, next, channel_id } = getMessageDto;

    if (prev === -1 && next === -1) {
      // ToDO : 안읽은 메세지 찾기
      return;
    }

    const channel = await this.channelRepository.findById(channel_id);
    const chatListId = channel.chatLists[prev ?? next];
    const chatList = await this.chatListRespository.findById(chatListId);

    return JSON.parse(JSON.stringify(chatList)).chat;
  }
}
