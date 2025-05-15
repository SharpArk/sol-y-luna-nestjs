import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    const data = await this.prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    return data;
  }
}
