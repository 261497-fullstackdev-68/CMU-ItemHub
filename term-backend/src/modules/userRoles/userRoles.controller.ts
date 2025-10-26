import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserRolesService } from './userRoles.service';
import { CreateUserRoleDto } from './dto/create.dto';
import { UpdateUserRoleDto } from './dto/update.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Role } from '@prisma/client';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('userRoles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  // @Roles()
  create(@Body() dto: CreateUserRoleDto) {
    return this.userRolesService.create(dto);
  }

  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get('/findByUserId/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userRolesService.findOneByUserId(userId);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.remove(id);
  }
}
