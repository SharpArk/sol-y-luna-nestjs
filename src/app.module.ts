import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { StoreModule } from './store/store.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientDataModule } from './client-data/client-data.module';

@Module({
  imports: [StoreModule, PrismaModule, AuthModule, UsersModule, ClientDataModule, ConfigModule.forRoot({
    isGlobal:true,
    envFilePath: ".env",
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
