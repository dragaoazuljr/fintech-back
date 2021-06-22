import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PixService } from '../pix/pix.service';
import { UsersService } from '../users/users.service';
import { Pix } from '../pix/schema/pix.schema';
import { User } from '../users/schemas/user.schema';
import { Transaction } from './schema/transaction.schema';
import { TransactionsService } from './transactions.service';
import { BadRequestException } from '@nestjs/common';
import { UserMockClassService } from '../users/mocks/user-service.mock';
import { pixServiceMock } from '../pix/mocks/pix-service.mock';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let pixService: PixService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(Pix.name), useValue: {} },
        { provide: getModelToken(Transaction.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        UsersService,
        PixService
      ],
    })
    .overrideProvider(UsersService)
    .useClass(UserMockClassService)
    .compile();

    service = module.get<TransactionsService>(TransactionsService);
    pixService = module.get<PixService>(PixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to create transaction to a invalid userid', () => {
    const transactionData = {
      userTo: "3",
      pixToKey: "user@test.com",
      desc: "",
      value: 10,
      currency: "BRL"
    }

    const res = service.createTransaction(transactionData);

    expect(res)
      .rejects
      .toThrow(BadRequestException)
  })

  it ("should not be able to create transaction to a invalid pix key", () => {
    const transactionData = {
      userTo: "1",
      pixToKey: "invalid-key",
      desc: "",
      value: 10,
      currency: "BRL"
    }

    jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([]);

    const res = service.createTransaction(transactionData);

    expect(res)
      .rejects
      .toThrow(BadRequestException)
  })
});
