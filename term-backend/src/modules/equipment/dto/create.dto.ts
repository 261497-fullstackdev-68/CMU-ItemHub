import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEquipmentDto {
  @IsInt()
  organizationId: number;

  @IsInt()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  imageName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  totalQuantity: number;

  @IsBoolean()
  isAvailable: boolean;
}
