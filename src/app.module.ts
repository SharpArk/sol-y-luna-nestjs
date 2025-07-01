import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientDataModule } from './client-data/client-data.module';

@Module({
  imports: [StoreModule, PrismaModule, AuthModule, UsersModule, ClientDataModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
