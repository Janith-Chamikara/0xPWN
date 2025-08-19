import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { WriteupService } from './writeup.service';
import { CreateWriteUpDto } from './dto/create-writeup.dto';

@Controller('writeup')
export class WriteupController {
  constructor(private readonly writeupService: WriteupService) {}
  @Post('create')
  async createWriteupHandler(@Body() createWriteUpDto: CreateWriteUpDto) {
    console.log('Creating writeup with data:', createWriteUpDto);
    await this.writeupService.createWriteUp(createWriteUpDto);
  }

  @Put('update')
  async updateWriteupHandler(
    @Query('id') writeupId: string,
    @Body() updateWriteUpDto: Partial<CreateWriteUpDto>,
  ) {
    await this.writeupService.updateWriteUpById(writeupId, updateWriteUpDto);
  }

  @Get('get-info-single')
  async getWritupByIdHandler(@Query('id') writeupId: string) {
    return await this.writeupService.getWriteupById(writeupId);
  }

  @Get('get-by-challenge')
  async getWriteupsByChallengeIdHandler(@Query('id') challengeId: string) {
    return await this.writeupService.getWriteUpsByChallengeId(challengeId);
  }

  @Delete('delete')
  async deleteWriteupHandler(@Query('id') writeupId: string) {
    await this.writeupService.deleteWriteUpById(writeupId);
  }
}
