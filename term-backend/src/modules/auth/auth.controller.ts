import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { ExternalApiService } from '../external-api/external-api.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRolesService } from '../userRoles/userRoles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private externalApi: ExternalApiService,
    private userService: UsersService,
    private roleService: UserRolesService,

    @Inject('ACCESS_JWT_SERVICE')
    private readonly accessJwt: JwtService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwt: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() reqBody: { authorizationCode: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const authorizationCode: string = reqBody.authorizationCode;
    if (!authorizationCode || typeof authorizationCode !== 'string')
      return res.json({
        ok: false,
        message: 'Invalid authorization code',
        statusCode: 400,
      });

    const cmuAccessToken =
      await this.externalApi.getEntraIDAccessToken(authorizationCode);
    const basicInfo = await this.externalApi.getCMUBasicInfo(cmuAccessToken);
    const profile = this.externalApi.prepareProfile(basicInfo);

    let user = await this.authService.validateUserByEmail(profile.email);
    if (!user) {
      user = await this.userService.createUser(profile);
      await this.roleService.create({ userId: user.id, role: 'USER' });
    }
    const appAccessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);

    res.cookie('access_token', appAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.status(200);
    return {
      ok: true,
      message: 'Login successful',
      user,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logout successful', ok: true };
  }

  @Get('check-cookie')
  checkCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('Cookies from client:', req.cookies);
    res.status(200);
    return {
      cookies: req.cookies,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      // Verify the refresh token
      const payload = this.refreshJwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      console.log('refresh payload:', payload);
      //check if user still exists or token is still valid
      const user = await this.authService.validateUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      // // Create new access token
      const newAccessToken = await this.authService.generateAccessToken(
        user.id,
      );

      // Send new cookie
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 min
      });

      res.status(200);

      return { ok: true };
    } catch (err) {
      console.error('Refresh failed:', err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
