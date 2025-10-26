import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentLoanDto } from './dto/create.dto';
import { UpdateEquipmentLoanDto } from './dto/update.dto';
import { LoanStatus } from '@prisma/client';

@Injectable()
export class EquipmentLoanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEquipmentLoanDto) {
    return this.prisma.equipmentLoan.create({ data });
  }

  async findAll() {
    return this.prisma.equipmentLoan.findMany({
      include: { equipment: true, borrower: true },
    });
  }

  async findByOrgId(organizationId: number) {
    return this.prisma.equipmentLoan.findMany({
      where: {
        equipment: {
          organizationId: organizationId,
        },
      },
      include: {
        equipment: true, // include equipment details
        borrower: true, // include borrower details
      },
    });
  }

  async findOne(id: number) {
    const loan = await this.prisma.equipmentLoan.findFirst({
      where: { id },
      include: { equipment: true, borrower: true },
    });
    if (!loan) throw new NotFoundException(`Loan ${id} not found`);
    return loan;
  }

  async findByOrgIdWithStatus(organizationId: number, status: LoanStatus) {
    return this.prisma.equipmentLoan.findMany({
      where: {
        status,
        equipment: {
          organizationId: organizationId,
        },
      },
    });
  }

  async update(id: number, data: UpdateEquipmentLoanDto) {
    const loan = await this.prisma.equipmentLoan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException(`Loan ${id} not found`);
    return this.prisma.equipmentLoan.update({ where: { id }, data });
  }

  async remove(id: number) {
    const loan = await this.prisma.equipmentLoan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException(`Loan ${id} not found`);
    return this.prisma.equipmentLoan.delete({ where: { id } });
  }
}
