import { Module } from '@nestjs/common';
import { WriteupController } from './writeup.controller';
import { WriteupService } from './writeup.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [WriteupController],
  providers: [WriteupService],
})
export class WriteupModule {}
