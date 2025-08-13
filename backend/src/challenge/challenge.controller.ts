import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}
  @Get('get-info-single')
  async getChallengeById(@Query('id') id: string) {
    return await this.challengeService.getChallengeById(id);
  }

  @Get('get-challenge-categories')
  async getCategories() {
    return await this.challengeService.getAllCategories();
  }

  @Public()
  @Get('get-info-all')
  async getAllRewardCatalogs() {
    return await this.challengeService.getAllChallenges();
  }

  @Post('create')
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Put('update')
  async updateChallenge(
    @Query('id') id: string,
    @Body() updateChallengeDto: CreateChallengeDto,
  ) {
    return await this.challengeService.updateChallengeById(
      id,
      updateChallengeDto,
    );
  }

  @Delete('delete')
  async deleteChallengeById(@Query('id') id: string) {
    return await this.challengeService.deleteChallengeById(id);
  }

  @Get('get-challenges-created-by-user')
  async getChallengesCreatedByUser(@Query('id') userId: string) {
    return await this.challengeService.getChallengesCreatedByUser(userId);
  }

  @Get('get-all-solved-challenges')
  async getAllSolvedChallenges(@Query('id') userId: string) {
    return await this.challengeService.getAllSolvedChallenges(userId);
  }
}
