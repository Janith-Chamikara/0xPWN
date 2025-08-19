import { Controller, Get, Query } from '@nestjs/common';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('user-solved-challenges')
  async getUserSolvedChallenges(@Query('userId') userId: string) {
    return this.submissionService.getUserSolvedChallenges(userId);
  }
}
