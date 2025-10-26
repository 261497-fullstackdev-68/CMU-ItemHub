import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create.dto';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
