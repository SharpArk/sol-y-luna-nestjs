import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        'Datos de cliente ya existente',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newClientData = await this.prisma.clientData.create({
      data: data,
    });

    return { message: 'Datos añadidos correctamente', newClientData };
  }
}
