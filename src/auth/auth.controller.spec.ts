import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMongoose } from '../users/mocks/user-schema-model-mock';
import { UserMockClassService } from '../users/mocks/user-service.mock';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import * as request from 'supertest'

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        UsersModule,
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
        { provide: UsersService, useClass: UserMockClassService },
        AuthService,
        LocalStrategy,
        LocalAuthGuard,
        JwtStrategy,
        JwtAuthGuard
      ]
    })
    .overrideProvider(getModelToken('User'))
    .useValue(mockMongoose)
    .compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not login user without email', (done) => {
    const userCredentials = {
      email: "",
      password: "User@10"
    }

    request(app.getHttpServer())
      .post("/auth/login")
      .send(userCredentials)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error ("missing error message");
        if (!res.body.message.includes("email should not be empty")) throw new Error ("missing empty email message")
      })
      .end(done)
  });

  it ('should not login user without password', (done) => {
    const userCredential = {
      email: "user@email.com",
      password: ""
    }

    request(app.getHttpServer())
    .post("/auth/login")
    .send(userCredential)
    .expect(400)
    .expect(res => {
      if (!res.body.message) throw new Error('Missing error message');
      if (!res.body.message.includes("password should not be empty")) throw new Error("Missing empty password message");
    })
    .end(done)
  })

  it ("should not login user with wrong credentials", (done) => {
    const userCredential = {
      email: "user@invalid.com",
      password: "userpassword"
    };

    request(app.getHttpServer())
      .post("/auth/login")
      .send(userCredential)
      .expect(401)
      .end(done)
  })
});
