import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWriteUpDto } from './dto/create-writeup.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class WriteupService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createWriteUp(createWriteUpDto: CreateWriteUpDto) {
    const isSubmissionExists = await this.prismaService.submission.findFirst({
      where: {
        challenge_id: createWriteUpDto.challenge_id,
        user_id: createWriteUpDto.user_id,
      },
    });

    if (!isSubmissionExists) {
      throw new BadRequestException(
        'You must submit a solution to the challenge before creating a writeup.',
      );
    }

    const isWriteupWithSameTitleExists =
      await this.prismaService.writeup.findFirst({
        where: {
          title: createWriteUpDto.title,
        },
      });
    if (isWriteupWithSameTitleExists) {
      throw new ConflictException(
        `Writeup with title "${createWriteUpDto.title}" already exists.`,
      );
    }
    const writeup = await this.prismaService.writeup.create({
      data: createWriteUpDto,
    });
    await this.notificationsService.create({
      type: NotificationType.SUCCESS,
      title: 'New Writeup Created',
      message: `A new writeup titled "${writeup.title}" has been created.`,
      userId: createWriteUpDto.user_id,
    });
  }

  async getWriteupById(id: string) {
    const writeup = await this.prismaService.writeup.findUnique({
      where: { writeup_id: id },
      include: {
        user: true,
      },
    });
    if (!writeup) {
      throw new NotFoundException(`Writeup with ID "${id}" not found.`);
    }
    return writeup;
  }

  async getWriteUpsByChallengeId(challengeId: string) {
    const writeUps = await this.prismaService.writeup.findMany({
      where: { challenge_id: challengeId },
    });
    if (writeUps.length === 0) {
      throw new NotFoundException(`No write ups found for this challenge.`);
    }
    return writeUps;
  }

  async updateWriteUpById(
    id: string,
    updateWriteUpDto: Partial<CreateWriteUpDto>,
  ) {
    const writeup = await this.prismaService.writeup.findUnique({
      where: { writeup_id: id },
    });
    if (!writeup) {
      throw new NotFoundException(`Writeup  not found.`);
    }
    await this.prismaService.writeup.update({
      where: { writeup_id: id },
      data: updateWriteUpDto,
    });
  }

  async deleteWriteUpById(id: string) {
    const writeup = await this.prismaService.writeup.findUnique({
      where: { writeup_id: id },
    });
    if (!writeup) {
      throw new NotFoundException(`Writeup with not found.`);
    }
    await this.prismaService.writeup.delete({
      where: { writeup_id: id },
    });
  }
}
