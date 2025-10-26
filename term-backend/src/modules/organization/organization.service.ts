import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create.dto';
import { UpdateOrganizationDto } from './dto/update.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrganizationDto) {
    return await this.prisma.organization.create({ data });
  }

  async findAll() {
    return await this.prisma.organization.findMany();
  }

  async findOne(id: number) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { equipment: true }, // relations
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  async update(id: number, data: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
