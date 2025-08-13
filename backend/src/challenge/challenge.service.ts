import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { NotificationType } from 'src/notifications/dto/create-notification.dto';
import { getHashedPassword } from 'src/lib/utils';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async getAllChallenges() {
    const challenge = await this.prismaService.challenge.findMany({
      include: { category: true },
    });
    console.log('All Challenges:', challenge);
    return challenge;
  }

  async getChallengeById(id: string) {
    const challenge = await this.prismaService.challenge.findUnique({
      where: { challenge_id: id },
      include: { category: true, user: true },
    });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    console.log('Challenge by ID:', challenge);
    return challenge;
  }

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    const isTitleExists = await this.prismaService.challenge.findFirst({
      where: { title: createChallengeDto.title },
    });
    if (isTitleExists) {
      throw new ConflictException('Challenge with this title already exists');
    }
    const hashedFlag = await getHashedPassword(createChallengeDto.flag);
    const challenge = await this.prismaService.challenge.create({
      data: {
        ...createChallengeDto,
        points: parseInt(createChallengeDto.points),
        flag: hashedFlag,
      },
    });
    await this.notificationService.create({
      userId: createChallengeDto.created_by,
      title: `New challenge created`,
      message: `Challenge "${createChallengeDto.title}" has been successfully created.`,
      type: NotificationType.SUCCESS,
    });
    if (!challenge) {
      throw new BadRequestException('Error creating challenge');
    }
    return challenge;
  }
  async deleteChallengeById(id: string) {
    const challenge = await this.getChallengeById(id);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    return this.prismaService.challenge.delete({
      where: { challenge_id: id },
      include: { category: true, user: true },
    });
  }

  async getAllCategories() {
    return this.prismaService.category.findMany({});
  }

  async getChallengesCreatedByUser(userId: string) {
    const challenges = await this.prismaService.challenge.findMany({
      where: { created_by: userId },
      include: { category: true },
    });
    if (!challenges || challenges.length === 0) {
      throw new NotFoundException('No challenges found for this user');
    }
    return challenges;
  }

  async getAllSolvedChallenges(userId: string) {
    const challenges = await this.prismaService.challenge.findMany({
      where: {
        user: {
          user_id: userId,
        },
      },
    });
    console.log('All Solved Challenges:', challenges);
  }

  async updateChallengeById(
    id: string,
    updateChallengeDto: CreateChallengeDto,
  ) {
    const challenge = await this.getChallengeById(id);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    const hashedFlag = await getHashedPassword(updateChallengeDto.flag);
    return this.prismaService.challenge.update({
      where: { challenge_id: id },
      data: {
        ...updateChallengeDto,
        points: parseInt(updateChallengeDto.points),
        flag: hashedFlag,
      },
    });
  }
}
