import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserRoleDto } from './dto/create.dto';
import { UpdateUserRoleDto } from './dto/update.dto';

@Injectable()
export class UserRolesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserRoleDto) {
    return await this.prisma.userRole.create({ data: data });
  }

  async findAll() {
    return await this.prisma.userRole.findMany({
      include: { user: true, organization: true },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.userRole.findUnique({
      where: { id },
      // include: { user: true, organization: true },
    });
    if (!role) throw new NotFoundException(`UserRole ${id} not found`);
    return role;
  }

  async findOneByUserId(userId: number) {
    const role = await this.prisma.userRole.findMany({
      where: { userId },
      // include: { user: true, organization: true },
    });
    if (!role)
      throw new NotFoundException(`UserRole with userId ${userId} not found`);
    return role;
  }

  async update(id: number, dto: UpdateUserRoleDto) {
    return this.prisma.userRole.update({
      where: { id },
      data: {
        userId: dto.userId,
        organizationId: dto.organizationId,
        role: dto.role,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.userRole.delete({ where: { id } });
  }
}
