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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    console.log(validateData);
    console.log(data);

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
}
