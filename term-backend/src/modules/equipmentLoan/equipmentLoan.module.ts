import { Module } from '@nestjs/common';
import { EquipmentLoanService } from './equipmentLoan.service';
import { EquipmentLoanController } from './equipmentLoan.controller';
import { jwtProviders } from '../auth/jwt.providers';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [EquipmentLoanController],
  providers: [EquipmentLoanService, ...jwtProviders, UsersService],
})
export class EquipmentLoanModule {}
