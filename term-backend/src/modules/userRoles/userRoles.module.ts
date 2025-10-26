import { Module, Global } from '@nestjs/common';
import { UserRolesService } from './userRoles.service';
import { UserRolesController } from './userRoles.controller';

@Global()
@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
