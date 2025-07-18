import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { name, pass } = body;
    return this.authService.signIn(name, pass, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.SECURE === 'true',
      sameSite: 'lax',
      domain: process.env.DOMAIN,
      maxAge: 0,
    });
    return { message: 'Logged out' };
  }

  @Post('register')
  async register(@Body() data) {
    return this.authService.register(data);
  }

  @Put('UpdateUser')
  async updateUser(@Body() data) {
    return this.authService.updateUserData(data);
  }
}
