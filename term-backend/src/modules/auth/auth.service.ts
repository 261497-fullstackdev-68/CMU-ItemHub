import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,

    @Inject('ACCESS_JWT_SERVICE')
    private readonly accessJwt: JwtService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwt: JwtService,
  ) {}

  async validateUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    return user;
  }

  async validateUserById(userId: number) {
    const user = await this.userService.findOneById(userId);
    return user;
  }

  async generateAccessToken(userId: number) {
    const roles = await this.prisma.userRole.findMany({
      where: { userId },
    });
    const roleNames = roles.map((r) => r.role);

    const payload = { userId, roles: roleNames };
    return this.accessJwt.sign(payload);
  }

  generateRefreshToken(userId: number) {
    return this.refreshJwt.sign({ userId });
  }

  verifyAccessToken(token: string) {
    return this.accessJwt.verify(token);
  }

  verifyRefreshToken(token: string) {
    return this.refreshJwt.verify(token);
  }
}
