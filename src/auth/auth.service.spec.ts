import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMongoose } from '../users/mocks/user-schema-model-mock';
import { UserMockClassService, UserMockValueService } from '../users/mocks/user-service.mock';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        ConfigModule.forRoot({ isGlobal: true}),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            signOptions: {
              expiresIn: "4h"
            },
            secret: configService.get('JWT_SECRET'),
            ignoreExpiration: false
          }),
          inject: [ConfigService]
        })
      ],
      providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        LocalAuthGuard,
        JwtStrategy,
        JwtAuthGuard,
      ],
    })
    .overrideProvider(UsersService)
    .useClass(UserMockClassService)
    .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not login user without email', () => {
    const userCredentials = {
      email: "",
      password: "User@123"
    }

    const spyFinduserByLogin = jest.spyOn(userService, 'findUserByLogin')
      .mockResolvedValue(null);

    expect(service.login(userCredentials))
      .rejects
      .toThrow(UnauthorizedException)
  })
  
  it('should not login user without password', () => {
    const userCrentials = {
      email: "user@email.com",
      password: "user@10"
    };

    const res = service.login(userCrentials);

    expect(res)
    .rejects
    .toThrow(UnauthorizedException)
  })
  
  it('should not login user with wrong credentials', () => {
    const userCredentials = {
      email: "email@email.com",
      password: "user@10",
    };

    //spy
    const spyFinduserByLogin = jest.spyOn(userService, 'findUserByLogin')
      .mockResolvedValue(null);

    const res = service.login(userCredentials);
    expect(res)
    .rejects
    .toThrow(UnauthorizedException);
  })
  
  it('should login user', async () => {
    const userCredentials = {
      email: "user@email.com",
      password: "User@10"
    }

    expect(await service.login(userCredentials))
      .toHaveProperty("access_token")
  })
});
