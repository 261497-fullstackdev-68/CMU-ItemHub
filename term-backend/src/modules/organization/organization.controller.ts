import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { UpdateOrganizationDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UserRolesService } from '../userRoles/userRoles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio/minio.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly userRoleService: UserRolesService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.SYSTEM_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { name: string; adminId?: number },
  ) {
    const { name, adminId } = data;
    console.log('org  Name:', name);
    const newOrg = await this.organizationsService.create({
      name: name,
      imageName: '',
      imageUrl: '',
    });
    const uniqueName = `${Date.now()}-${file.originalname}`;
    const filename = `${newOrg.id}_${name}/profile/${uniqueName}`;
    await this.minioService.uploadImage(filename, file.buffer, file.mimetype);
    const imageUrl = await this.minioService.getPresignedUrl(filename);
    newOrg.imageName = filename;
    newOrg.imageUrl = imageUrl;
    await this.organizationsService.update(newOrg.id, {
      imageName: filename,
      imageUrl: imageUrl,
    });
    if (adminId) {
      const orgAdmin = await this.userRoleService.create({
        userId: adminId,
        organizationId: newOrg.id,
        role: 'ORG_STAFF',
      });

      return { newOrg, orgAdmin };
    }

    return { newOrg };
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrganizationDto) {
    return this.organizationsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
