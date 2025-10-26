import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/category/cateagory.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { EquipmentLoanModule } from './modules/equipmentLoan/equipmentLoan.module';
import { MinioModule } from './modules/minio/minio.module';
import { OrganizationsModule } from './modules/organization/organization.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { UserRolesModule } from './modules/userRoles/userRoles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
    }),
    AuthModule,
    CategoriesModule,
    EquipmentModule,
    EquipmentLoanModule,
    MinioModule,
    OrganizationsModule,
    PrismaModule,
    UsersModule,
    UserRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
