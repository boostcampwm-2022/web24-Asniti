import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { responseForm } from '@utils/responseForm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChannelService } from '@channel/channel.service';
import { CreateChannelDto, DeleteChannelDto, ModifyChannelDto } from '@channel/dto';
import { JwtAccessGuard } from '@auth/guard';

@Controller('api/channel')
export class ChannelController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private channelService: ChannelService,
  ) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req: any) {
    const _id = req.user._id;
    try {
      await this.channelService.createChannel({ ...createChannelDto, managerId: _id });
      return responseForm(200, { message: '채널 생성 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyChannel(@Body() modifyChannelDto: ModifyChannelDto, @Req() req: any) {
    const _id = req.user._id;
    try {
      await this.channelService.modifyChannel({ ...modifyChannelDto, managerId: _id });
      return responseForm(200, { message: '채널 수정 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete(':community_id/user/:channel_id')
  @UseGuards(JwtAccessGuard)
  async exitChannel(
    @Param('community_id') community_id,
    @Param('channel_id') channel_id,
    @Req() req: any,
  ) {
    const user_id = req.user._id;
    try {
      await this.channelService.exitChannel({ community_id, channel_id, user_id });
      return responseForm(200, { message: '채널 퇴장 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getChannelInfo(@Param('id') channel_id: string) {
    return await this.channelService.getChannelInfo(channel_id);
  }
}
