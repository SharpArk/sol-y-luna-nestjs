import { Body, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      username: user.name,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    return {
      message: 'login sucefull',
    };
  }

  async register(@Body() data: any) {
    const userData = data;
    const newUser = await this.usersService.create(userData);
    return newUser;
  }
}
