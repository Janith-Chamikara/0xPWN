import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [NotificationsModule, PrismaModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
