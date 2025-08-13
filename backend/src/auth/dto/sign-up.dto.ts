import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly wallet: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsOptional()
  readonly bio: string;
}
