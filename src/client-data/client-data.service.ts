import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientDataService {
  constructor(private prisma: PrismaService) {}
  async newClientData(data: any) {
    const Validate = await this.prisma.clientData.findMany({
      where: {
        Phone: String(data.Phone),
      },
    });

    if (Validate.length !== 0) {
      return { message: 'Datos de cliente ya existente' };
    }

    const newClientData = await this.prisma.clientData.create({
      data: data,
    });

    return newClientData;
  }
}
