import {
  BadRequestException,
  Body,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const existingAdmins = await this.usersService.findAdmin();

    if (!existingAdmins) {
      const hashedPassword = await bcrypt.hash('Mamilindamuak2', 10); // usa env si quieres
      const name = 'Sieghart205';
      await this.usersService.createAdmin({
        name,
        password: hashedPassword,
        role: 'admin',
      });
    }
  }

  async signIn(
    name: string,
    pass: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.usersService.findOne(name);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = bcrypt.compareSync(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      image: user.image,
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    return {
      message: 'login successful',
    };
  }

  async register(@Body() data: any) {
    const userData = data;

    const validateData = await this.usersService.findOne(userData.name);

    if (validateData !== null) {
      throw new BadRequestException('Usuario ya existente');
    }

    if (userData.pass == '') {
      throw new BadRequestException('La contraseña no puede estar vacía');
    }

    const passwordHash = await bcrypt.hash(userData.pass, 10);

    const newUser = await this.usersService.create({
      name: userData.name,
      password: passwordHash,
    });
    return newUser;
  }

  async updateUserData(data: any) {
    const { name, password, id } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new BadRequestException('No se encontró el usuario');
    }

    const userWithSameName = await this.prisma.user.findFirst({
      where: { name },
    });

    if (userWithSameName && userWithSameName.id !== id) {
      throw new BadRequestException('Nombre de usuario ya está en uso');
    }

    try {
      const newPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { name, password: newPassword },
      });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al actualizar usuario',
      );
    }
  }
}
