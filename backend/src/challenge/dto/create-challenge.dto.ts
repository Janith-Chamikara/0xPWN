import { IsString, IsUUID } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsUUID('4', { message: 'Invalid category ID format' })
  readonly category_id: string;

  @IsString()
  readonly difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

  @IsString()
  readonly resources: string;

  @IsString()
  readonly points: string;

  @IsString()
  readonly flag: string;

  @IsUUID('4', { message: 'Invalid user ID format' })
  readonly created_by: string;
}
