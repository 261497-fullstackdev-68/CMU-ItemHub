import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create.dto';
import { UpdateEquipmentDto } from './dto/update.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEquipmentDto) {
    return this.prisma.equipment.create({ data });
  }

  async findAll() {
    return this.prisma.equipment.findMany({ include: { loans: true } });
  }

  async findByOrgId(organizationId: number) {
    return this.prisma.equipment.findMany({
      where: { organizationId },
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: { loans: true },
    });
    if (!equipment) throw new NotFoundException(`Equipment ${id} not found`);
    return equipment;
  }

  async update(id: number, data: UpdateEquipmentDto) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException(`Equipment ${id} not found`);
    return this.prisma.equipment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException(`Equipment ${id} not found`);
    return this.prisma.equipment.delete({ where: { id } });
  }

  // Calculate quantity available dynamically
  async availableQuantity(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: { loans: true },
    });
    if (!equipment) throw new NotFoundException(`Equipment ${id} not found`);

    const borrowedAmount = equipment.loans
      .filter((loan) => ['pending', 'approved'].includes(loan.status))
      .reduce((sum, loan) => sum + loan.amount, 0);

    const withOutLoan = await this.prisma.equipment.findUnique({
      where: { id },
      include: { organization: true, category: true },
    });

    return {
      ...withOutLoan,
      quantityAvailable: equipment.totalQuantity - borrowedAmount,
    };
  }
}
