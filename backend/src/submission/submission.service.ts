import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserSolvedChallenges(userId: string) {
    return this.prismaService.submission.findMany({
      where: { user_id: userId },
      include: {
        challenge: true,
      },
    });
  }
}
