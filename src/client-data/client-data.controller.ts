import { Body, Controller, Post } from '@nestjs/common';
import { ClientDataService } from './client-data.service';

@Controller('client-data')
export class ClientDataController {
  constructor(private readonly clientDataService: ClientDataService) {}

  @Post('/NewClientData')
  async postNewClientData(@Body() data: any) {
    return this.clientDataService.newClientData(data);
  }
}
