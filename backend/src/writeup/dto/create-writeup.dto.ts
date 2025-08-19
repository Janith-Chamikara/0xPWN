import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum WriteupVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class CreateWriteUpDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  challenge_id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(WriteupVisibility)
  @IsOptional()
  visibility: WriteupVisibility = WriteupVisibility.PUBLIC;
}
