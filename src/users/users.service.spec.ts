import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchemaModelMock } from './mocks/user-schema-model-mock';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  const userCredentials = {
    name: 'User',
    email: 'user@email.com',
    password: 'User@10'
  };
  const userCreated = {
    _id: "1",
    email: 'user@email.com',
    password: 'User@10'
  };

  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useClass: UserSchemaModelMock }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', () => {
    const userData = {
      name: 'User',
      email: 'user1@email.com',
      password: '123User@'
    };

    expect(service.createUser(userData))  
      .toBeTruthy();
  });

  it('should not create user already created', () => {
    expect(service.createUser(userCredentials)).rejects
  });
   
  it('should find user by id', async () => {
    expect(await service.findUser(userCreated._id)).toStrictEqual(userCreated)
  });

  it('should find user by login', async () => {
    expect(await service.findUserByLogin(userCreated.email)).toStrictEqual(userCreated)
  })
});
