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

  async create(data: User): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        password: data.password,
      },
    });

    return newUser;
  }

  async findAdmin(): Promise<User | undefined> {
    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    });

    return admin;
  }

  async createAdmin(data: User): Promise<User> {
    const newAdmin = await this.prisma.user.create({
      data: {
        name: data.name,
        password: data.password,
        role: 'admin',
      },
    });

    return newAdmin;
  }
}
