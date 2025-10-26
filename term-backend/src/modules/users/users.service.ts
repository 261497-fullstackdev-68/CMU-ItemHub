import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOneByEmail(email: string) {
    const response = await this.prisma.user.findUnique({
      where: { email },
    });
    return response;
  }

  async findOneById(id: number) {
    const response = await this.prisma.user.findUnique({
      where: { id },
    });
    return response;
  }

  async createUser(userData: CreateUserDto) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async deleteUser(userId: number) {
    // First check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Delete all user roles first
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // Delete user
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
