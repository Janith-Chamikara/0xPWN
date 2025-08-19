import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RewardModule } from './reward/reward.module';
import { ChallengeModule } from './challenge/challenge.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WriteupModule } from './writeup/writeup.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    UserModule,
    RewardModule,
    ChallengeModule,
    WriteupModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
