import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { accountType } from '@prisma/client';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  preName?: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  faculty: string;

  @IsEnum(accountType)
  accountType: accountType;

  @IsOptional()
  @IsString()
  studentID?: string;

  @IsOptional()
  createdAt?: Date;
}
