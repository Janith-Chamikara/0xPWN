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
import { comparePassword, getHashedPassword } from 'src/lib/utils';
import { SolveChallengeDto } from './dto/solve-challenge.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
    private readonly cloudinaryService: CloudinaryService,
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

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
    file?: Express.Multer.File,
  ) {
    const isTitleExists = await this.prismaService.challenge.findFirst({
      where: { title: createChallengeDto.title },
    });
    if (isTitleExists) {
      throw new ConflictException('Challenge with this title already exists');
    }
    const hashedFlag = await getHashedPassword(createChallengeDto.flag);

    let thumbnailUrl = null;

    if (file && file.buffer && file.buffer.length > 0) {
      try {
        const uploadResult = await this.cloudinaryService.uploadBuffer(
          file.buffer,
          file.originalname,
          {
            folder: `challenges`,
            resource_type: 'auto',
          },
        );
        thumbnailUrl = uploadResult.public_id;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        // Continue without thumbnail if upload fails
        console.log('Continuing without thumbnail due to upload error');
      }
    } else {
      console.log('No valid file provided for thumbnail upload');
    }
    const challenge = await this.prismaService.challenge.create({
      data: {
        ...createChallengeDto,
        points: parseInt(createChallengeDto.points),
        flag: hashedFlag,
        thumbnail: thumbnailUrl,
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

  async solveChallenge(solveChallengeDto: SolveChallengeDto) {
    const challenge = await this.getChallengeById(
      solveChallengeDto.challenge_id,
    );
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    const isTheSolverIsTheCreator =
      challenge.created_by === solveChallengeDto.user_id;
    if (isTheSolverIsTheCreator) {
      throw new BadRequestException(
        'You cannot solve your own challenge. Please create a new challenge for others to solve.',
      );
    }
    const isAlreadySolved = await this.prismaService.submission.findFirst({
      where: {
        challenge_id: solveChallengeDto.challenge_id,
        user_id: solveChallengeDto.user_id,
      },
    });
    if (isAlreadySolved) {
      throw new BadRequestException('You have already solved this challenge.');
    }
    const isFlagCorrect = await comparePassword(
      solveChallengeDto.flag,
      challenge.flag,
    );
    if (!isFlagCorrect) {
      throw new BadRequestException('Incorrect flag. Try again.');
    }
    const user = await this.prismaService.user.findUnique({
      where: { user_id: solveChallengeDto.user_id },
    });
    await this.prismaService.challenge.update({
      where: { challenge_id: solveChallengeDto.challenge_id },
      data: {
        solves: challenge.solves + 1,
      },
    });
    await this.prismaService.user.update({
      where: { user_id: solveChallengeDto.user_id },
      data: {
        solves: user.solves + 1,
        experience: user.experience + challenge.points,
      },
    });
    await this.prismaService.submission.create({
      data: {
        challenge_id: solveChallengeDto.challenge_id,
        user_id: solveChallengeDto.user_id,
        submission_time: new Date(),
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.notificationService.create({
      userId: user.user_id,
      title: `Challenge Solved`,
      message: `Challenge "${challenge.title}" has been successfully solved. You earned ${challenge.points} points!`,
      type: NotificationType.SUCCESS,
    });
    return { message: 'Challenge solved successfully' };
  }
}
