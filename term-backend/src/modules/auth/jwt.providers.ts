import { JwtService } from '@nestjs/jwt';

export const jwtProviders = [
  {
    provide: 'ACCESS_JWT_SERVICE',
    useFactory: () =>
      new JwtService({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
  },
  {
    provide: 'REFRESH_JWT_SERVICE',
    useFactory: () =>
      new JwtService({
        secret: process.env.JWT_REFRESH_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
  },
];
