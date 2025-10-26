import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EquipmentLoanService } from './equipmentLoan.service';
import { UpdateEquipmentLoanDto } from './dto/update.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoanStatus } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Controller('equipmentLoans')
export class EquipmentLoanController {
  constructor(
    private readonly loanService: EquipmentLoanService,
    private readonly userService: UsersService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwt: JwtService,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body()
    body: {
      equipmentId: number;
      amount: number;
      status: LoanStatus;
      borrowedAt?: Date;
      returnedAt?: Date;
      note?: string;
    },
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing token');
    }
    let payload;
    try {
      payload = await this.refreshJwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      // err.name can be 'JsonWebTokenError', 'TokenExpiredError', etc.
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

    const newLoan = { ...body, borrowerId: user.id };
    const result = this.loanService.create(newLoan);
    return res.status(201).json({
      ok: true,
      message: 'Loan created successfully',
      data: result,
    });
  }

  @Get()
  findAll() {
    return this.loanService.findAll();
  }

  @Get('/findByOrgId/:id')
  findByOrgId(@Param(':id') id: number) {
    return this.loanService.findByOrgId(id);
  }

  @Get('/findByOrgIdWithStatus')
  findByOrgIdWithStatus(
    @Query('status') status: LoanStatus,
    @Query('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.loanService.findByOrgIdWithStatus(orgId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentLoanDto) {
    return this.loanService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }
}
