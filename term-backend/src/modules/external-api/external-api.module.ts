import { Module } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';

@Module({
  providers: [ExternalApiService],
  exports: [ExternalApiService], // export so AuthService can use it
})
export class ExternalApiModule {}
