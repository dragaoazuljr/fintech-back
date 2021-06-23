import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { mock_jwtGuard } from '../auth/mocks/jwt-guard.mock';
import { PixService } from '../pix/pix.service';
import { Pix } from '../pix/schema/pix.schema';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { Transaction } from './schema/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import * as request from "supertest";
import { INestApplication } from '@nestjs/common';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: getModelToken(Pix.name), useValue: {} },
        { provide: getModelToken(Transaction.name), useValue: { } },
        { provide: getModelToken(User.name), useValue: {} },
        UsersService,
        TransactionsService,
        PixService
      ]
    })
    .overrideGuard(JwtAuthGuard).useValue(mock_jwtGuard)
    .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    app = module.createNestApplication();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should validate if has userTo on the request", (done) => {
    const createTransactionData = {
      userTo: null,
      pixToKey: 'user@test.com',
      value: 10,
      currency: "BRL"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("userTo should not be empty")) throw new Error("missing userTo validation")
      })
      .end(done)
  })
  
  it("should validate if has pixToKey on the request", (done) => {
    const createTransactionData = {
      userTo: 1,
      value: 10,
      currency: "BRL"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("pixToKey should not be empty")) throw new Error("missing pixToKey validation")
      })
      .end(done)
  })
  
  it("should validate if has value on the request", (done) => {
    const createTransactionData = {
      userTo: 1,
      pixToKey: 'user@test.com',
      currency: "BRL"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("value should not be empty")) throw new Error("missing value validation")
      })
      .end(done)
  })

  it("should validate if value is a number", (done) => {
    const createTransactionData = {
      userTo: 1,
      pixToKey: 'user@test.com',
      value: "aa",
      currency: "BRL"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("value must be a number conforming to the specified constraints")) throw new Error("missing value is number validation")
      })
      .end(done)
  })

  it("should validate if has currency on the request", (done) => {
    const createTransactionData = {
      userTo: 1,
      pixToKey: 'user@test.com',
      value: 10
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("currency should not be empty")) throw new Error("missing currency validation")
      })
      .end(done)
  })

  it("should validate if currency is only letters", (done) => {
    const createTransactionData = {
      userTo: 1,
      pixToKey: 'user@test.com',
      value: 10,
      currency: "123"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("currency must contains only letters")) throw new Error("missing currency validation")
      })
      .end(done)
  })

  it("should validate if currency is the correct length", (done) => {
    const createTransactionData = {
      userTo: 1,
      pixToKey: 'user@test.com',
      value: 10,
      currency: "BRLA"
    }

    request(app.getHttpServer())
      .post("/transactions")
      .send(createTransactionData)
      .expect(400)
      .expect(res => {
        if (!res.body.message) throw new Error("missing body validation")
        if (!res.body.message.includes("invalid currency")) throw new Error("missing currency length validation")
      })
      .end(done)
  })
});
