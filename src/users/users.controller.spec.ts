import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import * as request from 'supertest';
import { UsersService } from './users.service';

/* jest.mock('@nestjs/mongoose', () => ({
  MongooseModule: {
    forRoot: () => {},
    Prop: () => {}
  }
})) */
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';


describe('UsersController', () => {
  const userCredentials = {
    email: 'user@email.com',
    password: 'User@10'
  };
  const userCreated = {
    _id: 1,
    email: 'user@email.com',
    password: 'User@10'
  };
  const users = [
    {...userCreated}
  ];

  const mockMongoose = {
    find() {
      return {}
    }
  }

  let controller: UsersController;
  let app: INestApplication;
  let userService = {
    createUser: () => new Promise((resolve, reject) => resolve(userCreated)),
    findUserBylogin: (login) => new Promise(resolve => resolve(users.find(user => user.email === login))),
    findUser: (_id) => new Promise(resolve => resolve(users.find(user => user._id === _id)))
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: userService }
      ]
    })
      .overrideProvider(getModelToken('User'))
      .useValue(mockMongoose)
      .compile();

    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should not create user with a not safe password', () => {});
  
  // it('should not create user with a invalid email', () => {});
  
  // it('should not create user that already existl', () => {});
  
  // it('should find user by _id', () => {});
  
  // it('should return all users', () => {});
});
