import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Opcional si quieres evitar importar en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
