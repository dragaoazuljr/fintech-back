import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalAuthGuard } from './strategy/local-auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    LocalAuthGuard
  ]
})
export class AuthModule {}
