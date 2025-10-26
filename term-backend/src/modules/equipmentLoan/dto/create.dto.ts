import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class CreateEquipmentLoanDto {
  @IsInt()
  @IsNotEmpty()
  equipmentId: number;

  @IsInt()
  @IsNotEmpty()
  borrowerId: number;

  @IsInt()
  @Min(1)
  amount: number;

  @IsEnum(LoanStatus)
  status: LoanStatus;

  @IsOptional()
  borrowedAt?: Date;

  @IsOptional()
  returnedAt?: Date;

  @IsOptional()
  @IsString()
  note?: string;
}
