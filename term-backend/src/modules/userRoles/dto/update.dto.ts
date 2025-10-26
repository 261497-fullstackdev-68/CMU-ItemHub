import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRoleDto } from './create.dto';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {}
