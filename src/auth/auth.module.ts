import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: "4h"
        },
        secretOrPrivateKey: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtService
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
