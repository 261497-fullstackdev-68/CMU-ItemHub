import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentLoanDto } from './create.dto';

export class UpdateEquipmentLoanDto extends PartialType(
  CreateEquipmentLoanDto,
) {}
