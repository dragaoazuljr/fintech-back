import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMongoose } from '../users/mocks/user-schema-model-mock';
import { UserMockService } from '../users/mocks/user-service.mock';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [UsersModule],
      providers: [
        { provide: UsersService, useClass: UserMockService },
        AuthService,
      ]
    })
    .overrideProvider(getModelToken('User'))
    .useValue(mockMongoose)
    .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
