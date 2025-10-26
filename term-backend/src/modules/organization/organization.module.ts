import { Global, Module } from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { OrganizationsController } from './organization.controller';

@Global()
@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
