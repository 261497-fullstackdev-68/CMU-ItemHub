import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Delete,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRolesService } from '../userRoles/userRoles.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userRoleService: UserRolesService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/info')
  async getUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    let payload;
    try {
      payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    const user = await this.userService.findOneById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const userRoles = await this.userRoleService.findOneByUserId(
      payload.userId,
    );

    const filteredRoles = userRoles.map(({ organizationId, role }) => ({
      organizationId,
      role,
    }));
    res.status(200);
    return { ok: true, user, roles: filteredRoles };
  }

  @Get('/getAllUsers')
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/getOneByEmail')
  getByEmail(@Query('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get('/getOneById')
  getById(@Query('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Post('/createUser')
  createUser(@Body() userData: CreateUserDto) {
    console.log('create user with data: ', userData);
    return this.userService.createUser(userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.deleteUser(+id);
  }
}
