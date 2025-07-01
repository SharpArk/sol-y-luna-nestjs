import { Module } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { ClientDataController } from './client-data.controller';

@Module({
  controllers: [ClientDataController],
  providers: [ClientDataService],
})
export class ClientDataModule {}
