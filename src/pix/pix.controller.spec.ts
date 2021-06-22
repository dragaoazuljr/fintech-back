import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMockClassService } from '../users/mocks/user-service.mock';
import { UsersService } from '../users/users.service';
import { pixServiceMock } from './mocks/pix-service.mock';
import { PixController } from './pix.controller';
import { PixService } from './pix.service';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { mock_jwtGuard } from '../auth/mocks/jwt-guard.mock';
import { AuthService } from '../auth/auth.service';


describe('PixController', () => {
  let controller: PixController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PixController],
      providers: [
        { provide: UsersService, useClass: UserMockClassService },
        { provide: PixService, useValue: pixServiceMock},
        { provide: AuthService, useValue: {} }
      ]
    })
    .overrideGuard(JwtAuthGuard).useValue(mock_jwtGuard)
    .compile();

    controller = module.get<PixController>(PixController);
    app = module.createNestApplication();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ("should not be able to create pix key without key", (done) => {
    const createKeyData = {
      key: "",
      user: "1",
      label: "email"
    }
    request(app.getHttpServer())
      .post("/pix")
      .send(createKeyData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing error message");
        if (!res.body.message.includes("key should not be empty")) throw new Error("missing key validation");
      })
      .end(done)
  })

  it ("should not be able to create pix key without user", (done) => {
    const createKeyData = {
      key: "user@email.com",
      user: "",
      label: "email"
    }

    request(app.getHttpServer())
      .post("/pix")
      .send(createKeyData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing erro message");
        if (!res.body.message.includes("user should not be empty")) throw new Error("missing user validation")
      })
      .end(done)
  })
});
