import { BadRequestException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
  const users = [
    {...userCreated}
  ];

  let service: UsersService;
  const mockMongoose = {
    find() {
      return {}
    },
    save() {
      return {}
    }
  }

  const UserSchemaModelMock = {
    find: ({ login }) => ({exec: () => new Promise( (resolve, rejection) => resolve (users.find(user => user.email === login)))}),
    findById: (_id) => ({exec: () => new Promise( (resolve, rejection) => resolve (users.find(user => user._id === _id)))}),
    save: (user) => new Promise( (resolve, rejection) => resolve(user))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'UserModel', useValue: UserSchemaModelMock}
      ],
    }).overrideProvider(getModelToken('userModel'))
      .useValue(mockMongoose)
      .compile();

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

    expect(service.createUser(userData)).toBeTruthy();
  });

  it('should not create user already created', () => {
    expect(service.createUser(userCredentials)).rejects.toThrow(BadRequestException)
  });
   
  it('should find user by id', async () => {
    expect(await service.findUser(userCreated._id)).toStrictEqual(userCreated)
  });

  it('should find user by login', async () => {
    expect(await service.findUserByLogin(userCreated.email)).toStrictEqual(userCreated)
  })
});
