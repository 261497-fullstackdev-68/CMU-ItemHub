import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create.dto';
import { UpdateEquipmentDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationsService } from '../organization/organization.service';
import { MinioService } from '../minio/minio.service';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly organizationService: OrganizationsService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      organizationId: number;
      categoryId: number;
      name: string;
      description?: string;
      totalQuantity: number;
      isAvailable: string;
    },
  ) {
    const organizationId = Number(body.organizationId);
    const categoryId = Number(body.categoryId);
    const totalQuantity = Number(body.totalQuantity);
    const isAvailable = body.isAvailable === 'true';
    const organization = await this.organizationService.findOne(organizationId);
    const equipment: CreateEquipmentDto = {
      organizationId,
      categoryId,
      totalQuantity,
      imageName: '',
      imageUrl: '',
      name: body.name,
      description: body.description,
      isAvailable,
    };
    const newEquipment = await this.equipmentService.create(equipment);

    const filename = `${organization.id}_${organization.name}/equipment/${newEquipment.id}_${file.originalname}`;
    await this.minioService.uploadImage(filename, file.buffer, file.mimetype);
    const imageUrl = await this.minioService.getPresignedUrl(filename);
    await this.equipmentService.update(newEquipment.id, {
      imageName: filename,
      imageUrl: imageUrl,
    });

    newEquipment.imageName = filename;
    newEquipment.imageUrl = imageUrl;
    return newEquipment;
  }

  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get('/findByOrganizationId/:organizationId')
  findByOrganizationID(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.equipmentService.findByOrgId(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.availableQuantity(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateEquipmentDto,
  ) {
    const oldData = await this.equipmentService.findOne(Number(id));
    const orgData = await this.organizationService.findOne(
      oldData.organizationId,
    );
    const isAvailable = String(body.isAvailable) === 'true';
    if (file) {
      const filename = `${orgData.id}_${orgData.name}/equipment/${oldData.id}_${file.originalname}`;

      await this.minioService.uploadImage(filename, file.buffer, file.mimetype);
      const imageUrl = await this.minioService.getPresignedUrl(filename);

      return this.equipmentService.update(+id, {
        ...body,
        organizationId: Number(body.organizationId),
        totalQuantity: Number(body.totalQuantity),
        categoryId: Number(body.categoryId),
        isAvailable: isAvailable,
        imageName: filename,
        imageUrl,
      });
    }
    return this.equipmentService.update(+id, {
      ...body,
      organizationId: Number(body.organizationId),
      totalQuantity: Number(body.totalQuantity),
      categoryId: Number(body.categoryId),
      isAvailable: isAvailable,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }

  // Custom endpoint to get available quantity
  // @Get(':id/available')
  // availableQuantity(@Param('id') id: string) {
  //   return this.equipmentService.availableQuantity(+id);
  // }
}
