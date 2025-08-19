import { IsString, IsUUID } from 'class-validator';

export class SolveChallengeDto {
  @IsString()
  readonly flag: string;

  @IsUUID('4', { message: 'Invalid challenge ID format' })
  readonly challenge_id: string;

  @IsUUID('4', { message: 'Invalid user ID format' })
  readonly user_id: string;
}
