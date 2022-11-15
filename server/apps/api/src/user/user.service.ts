import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { followerDto } from '@user/dto/follower.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // createUser(createUserDto: CreateUserDto) {
  //   this.userRepository.create(createUserDto);
  // }

  async addFollowing(addFollowingDto: followerDto) {
    const user = await this.userRepository.findById(addFollowingDto.myId);
    const otherUser = await this.userRepository.findById(addFollowingDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    } else if (user.followings.includes(addFollowingDto.followId)) {
      throw new BadRequestException('팔로우 요청한 사용자는 이미 팔로우되어있습니다.');
    } else if (otherUser.followers.includes(addFollowingDto.myId)) {
      throw new ConflictException('상대방의 팔로워 목록에 이미 있습니다.');
    }
    this.userRepository.appendFollowing(addFollowingDto);
    this.userRepository.appendFollower(addFollowingDto);
  }

  async unFollowing(unFollowingDto: followerDto) {
    const user = await this.userRepository.findById(unFollowingDto.myId);
    const otherUser = await this.userRepository.findById(unFollowingDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    } else if (!user.followings.includes(unFollowingDto.followId)) {
      throw new BadRequestException(
        `팔로우 요청한 사용자 ${user.nickname}은 ${otherUser.nickname}을 팔로우하고 있지 않습니다.`,
      );
    } else if (!otherUser.followers.includes(unFollowingDto.myId)) {
      throw new ConflictException(
        `${otherUser.nickname}의 팔로워 목록에 ${user.nickname}가 없습니다.`,
      );
    }
    this.userRepository.deleteElementAtArr(
      { _id: unFollowingDto.myId },
      { followings: [unFollowingDto.followId] },
    );
    this.userRepository.deleteElementAtArr(
      { _id: unFollowingDto.followId },
      { followers: [unFollowingDto.myId] },
    );
  }
}
