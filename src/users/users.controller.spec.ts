import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { mockMongoose } from './mocks/user-schema-model-mock';
import { UserMockClassService } from './mocks/user-service.mock';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


describe('UsersController', () => {
  const userCreated = {
    _id: 1,
    email: 'user@email.com',
    password: 'User@10'
  };

  let controller: UsersController;
  let app: INestApplication;
  
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useClass: UserMockClassService }
      ]
    })
      .overrideProvider(getModelToken('User'))
      .useValue(mockMongoose)
      .compile();

    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();

    await app.init()
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not create user with a not safe password', (done) => {
    let userCreateData = {
      name: "User test",
      email: "user@test.com",
      password: "123"
    }

    request(app.getHttpServer())
      .post("/users")
      .send(userCreateData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error ("missing error message");
        if (!res.body.message.includes("password too weak")) throw new Error ("missing password too weak message");
        if (!res.body.message.includes("password must be longer than or equal to 6 characters")) throw new Error ("missing password min size validation");
      })
      .end(done)
  });

  it('should not create user with empty password', (done) => {
    const userCreateData = {
      name: "User Test",
      email: "user@test.com",
      password: ""
    };

    request(app.getHttpServer())
      .post("/users")
      .send(userCreateData)
      .expect(400)
      .expect(res => {
        if (!res.body.message.includes("password should not be empty")) throw new Error ("missing empty password validation");
      })
      .end(done)
  })

  it('should not create user with a invalid email', (done) => {
    const userCreateData = {
      name: "user test",
      email: "danillo.moraes",
      password: "User@123"      
    };

    request(app.getHttpServer())
      .post("/users")
      .send(userCreateData)
      .expect(400)
      .expect(res => {
        if (!res.body.message.includes("email must be an email")) throw new Error ("missing type email validation");
      })
      .end(done)
  });
  
  // it('should find user by _id', () => {});
  
  // it('should return all users', () => {});
});
