import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
    return this.authService.signIn(body.username, body.password, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // o true en prod
      sameSite: 'lax',
    });
    return { message: 'Logged out' };
  }

  @Post('register')
  async register(@Body() data) {
    return this.authService.register(data);
  }
}
