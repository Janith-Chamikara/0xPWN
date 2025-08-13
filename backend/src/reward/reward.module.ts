import { Module } from '@nestjs/common';
import { RewardsController } from './reward.controller';
import { RewardsService } from './reward.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [NotificationsModule],
  controllers: [RewardsController],
  providers: [RewardsService, PrismaService],
})
export class RewardModule {}
