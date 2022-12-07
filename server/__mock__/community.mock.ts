import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { ModifyCommunityDto } from '@community/dto';

export const communityDto1 = {
  name: 'asnity commu',
  description: 'test description',
  profileUrl: 'test profileUrl',
} as CreateCommunityDto;

export const modifyCommunityDto1 = {
  name: 'asnity',
  description: 'change description',
  profileUrl: 'change profileUrl',
} as ModifyCommunityDto;
