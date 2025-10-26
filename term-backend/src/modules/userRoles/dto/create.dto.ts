import { IsEnum, IsInt, IsOptional, Validate } from 'class-validator';
import { Role } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'RoleOrgConstraint', async: false })
export class RoleOrgConstraint implements ValidatorConstraintInterface {
  validate(role: Role, args: any) {
    const object = args.object as CreateUserRoleDto;
    // if orgId is present, role must be ORG_STAFF
    if (object.organizationId !== undefined) {
      return role === Role.ORG_STAFF;
    }
    // if orgId is not present, role must be USER or SYSTEM_ADMIN
    return role === Role.USER || role === Role.SYSTEM_ADMIN;
  }

  defaultMessage(args: any) {
    const object = args.object as CreateUserRoleDto;
    if (object.organizationId !== undefined) {
      return 'When organizationId is provided, role must be ORG_STAFF';
    }
    return 'When organizationId is not provided, role must be USER or SYSTEM_ADMIN';
  }
}

export class CreateUserRoleDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsEnum(Role)
  @Validate(RoleOrgConstraint)
  role: Role;
}
