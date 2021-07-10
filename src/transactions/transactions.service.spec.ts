import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PixService } from '../pix/pix.service';
import { UsersService } from '../users/users.service';
import { Pix } from '../pix/schema/pix.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Transaction, TransactionType } from './schema/transaction.schema';
import { TransactionsService } from './transactions.service';
import { BadRequestException } from '@nestjs/common';
import { UserMockClassService } from '../users/mocks/user-service.mock';
import { Document } from 'mongoose';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let pixService: PixService
  let usersService: UsersService

  const userTo = {
    _id: "2",
    name: "test user",
    email: "email@test.com",
    password: ""
  }

  const userFrom = {
    _id: "1",
    name: "test user",
    email: "email@test.com",
    password: ""  
  }

  const pixTo: Pix = {
    _id: "1",
    key: "email@test.com",
    label: "label",
    user: { ...userTo}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(Pix.name), useValue: {} },
        { provide: getModelToken(Transaction.name), useValue: { } },
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
    usersService = module.get<UsersService>(UsersService);
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

    const userFrom = "1"

    const res = service.createTransaction(transactionData, userFrom);

    expect(res)
      .rejects
      .toThrow(BadRequestException)
  })

  it ("should not be able to create transaction to a invalid pix key", async () => {
    const transactionData = {
      userTo: "1",
      pixToKey: "invalid-key",
      desc: "",
      value: 10,
      currency: "BRL"
    }

    const mockPixTo = {
      _id: "2",
      key: "key",
      label: "label",
      user: { ...userTo}
    };

    const userFromId = "2"

    const mockGetPix = jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([
      mockPixTo
    ]);
    const mockFindUser = jest.spyOn(usersService, "findUser")
      .mockResolvedValue({...userFrom})
      .mockResolvedValueOnce({...userFrom, _id: "2"})

    const res = service.createTransaction(transactionData, userFromId);

    expect(res)
      .rejects
      .toThrow(BadRequestException)

    expect(res)
      .rejects
      .toThrow("pix key does not belongs to this user")
  })
  
  it("should validate user when getting balance", () => {
    const userId = "1";
    
    jest.spyOn(usersService, "findUser").mockResolvedValue(null);
    
    const res = service.getUserBalance(userId)

    expect(res)
      .rejects
      .toThrow(BadRequestException)
  })

  it("should filter transactions and calculate balance", () => {
    const userId = "1";
    const findUserSpy = jest.spyOn(usersService, "findUser").mockResolvedValue({ ...userTo })
    const mockUserTransactions: Transaction[] = [
      {
        _id: "1",
        currency: "USD",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 9,
        type: TransactionType.CREDIT
      },{
        _id: "2",
        currency: "USD",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 3,
        type: TransactionType.DEBIT
      }
    ]
    const getUserTransactionsSpy = jest.spyOn(service, "getUserTransactions").mockResolvedValue(mockUserTransactions)

    const res = service.getUserBalance(userId);

    expect(res)
      .resolves
      .toEqual([
        {
          value: 6,
          currency: "USD"
        }
      ])
  })

  it ("should not realize transaction without balance on transaction currency", () => {
    const transactionData = {
      userTo: "2",
      pixToKey: "user@email.com",
      value: 10,
      currency: "BRL",
      desc: ""
    };

    const userFromId = "1"

    const mockFindUser = jest.spyOn(usersService, "findUser")
      .mockResolvedValue(null)
      .mockResolvedValueOnce(userTo)
      .mockResolvedValueOnce(userFrom)

    jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([
      {
        _id: "1",
        user: { ...userTo },
        key:"email@tes.com",
        label:"email"
      }
    ]);

    const mockUserTransactions: Transaction[] = [
      {
        _id: "1",
        currency: "USD",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 9,
        type: TransactionType.CREDIT
      }
    ]

    //spys
    const getUserTransactionSpy = jest.spyOn(service, "getUserTransactions").mockResolvedValue(mockUserTransactions)
    const findUserSpy = 
      jest.spyOn(usersService, "findUser")
        .mockResolvedValue(null)
        .mockResolvedValueOnce({ ...userTo})
        .mockResolvedValueOnce({ ...userFrom})
        .mockResolvedValueOnce({ ...userFrom})

    const res = service.createTransaction(transactionData, userFromId);

    expect(res)
      .rejects
      .toThrow(BadRequestException)

    expect(res)
      .rejects
      .toThrow("userFrom has no balance in this currency")
  })

  it ("should not realize transaction without sufficient balance", () => {
    const transactionData = {
      userTo: "2",
      pixToKey: "user@email.com",
      value: 10,
      currency: "BRL",
      desc: ""
    };

    const userFromId = "1"

    const mockFindUser = jest.spyOn(usersService, "findUser")
      .mockResolvedValue(null)
      .mockResolvedValueOnce(userTo)
      .mockResolvedValueOnce(userFrom)

    jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([
      {
        _id: "1",
        user: { ...userTo },
        key:"email@tes.com",
        label:"email"
      }
    ]);

    const mockUserTransactions: Transaction[] = [
      {
        _id: "1",
        currency: "BRL",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 9,
        type: TransactionType.CREDIT
      }
    ]

    //spys
    const getUserTransactionSpy = jest.spyOn(service, "getUserTransactions").mockResolvedValue(mockUserTransactions)
    const findUserSpy = 
      jest.spyOn(usersService, "findUser")
        .mockResolvedValue(null)
        .mockResolvedValueOnce({ ...userTo})
        .mockResolvedValueOnce({ ...userFrom})
        .mockResolvedValueOnce({ ...userFrom})

    const res = service.createTransaction(transactionData, userFromId);

    expect(res)
      .rejects
      .toThrow("insufficient balance to effectuate transaction");
    
    expect(res)
      .rejects
      .toThrow(BadRequestException);
  })

  it ("should not realize transaction with negative balance", () => {
    const transactionData = {
      userTo: "2",
      pixToKey: "user@email.com",
      value: 10,
      currency: "BRL",
      desc: ""
    };

    const userFromId = "1"

    const mockFindUser = jest.spyOn(usersService, "findUser")
      .mockResolvedValue(null)
      .mockResolvedValueOnce(userTo)
      .mockResolvedValueOnce(userFrom)

    jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([
      {
        _id: "1",
        user: { ...userTo },
        key:"email@tes.com",
        label:"email"
      }
    ]);

    const mockUserTransactions: Transaction[] = [
      {
        _id: "1",
        currency: "BRL",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 10,
        type: TransactionType.DEBIT
      }
    ]

    //spys
    const getUserTransactionSpy = jest.spyOn(service, "getUserTransactions").mockResolvedValue(mockUserTransactions)
    const findUserSpy = 
      jest.spyOn(usersService, "findUser")
        .mockResolvedValue(null)
        .mockResolvedValueOnce({ ...userTo})
        .mockResolvedValueOnce({ ...userFrom})
        .mockResolvedValueOnce({ ...userFrom})

    const res = service.createTransaction(transactionData, userFromId);

    expect(res)
      .rejects
      .toThrow("insufficient balance to effectuate transaction");
    
    expect(res)
      .rejects
      .toThrow(BadRequestException);
  })

  it("should create transaction", () => {
    const transactionData = {
      userTo: "2",
      pixToKey: "user@email.com",
      value: 10,
      currency: "BRL",
      desc: ""
    };

    const userFromId = "1"

    const mockFindUser = jest.spyOn(usersService, "findUser")
      .mockResolvedValue(null)
      .mockResolvedValueOnce(userTo)
      .mockResolvedValueOnce(userFrom)

    jest.spyOn(pixService, "getPixKeyByKey").mockResolvedValue([
      {
        _id: "1",
        user: { ...userTo },
        key:"email@tes.com",
        label:"email"
      }
    ]);

    const mockUserTransactions: Transaction[] = [
      {
        _id: "1",
        currency: "BRL",
        pixTo,
        desc: "",
        userFrom,
        userTo,
        value: 100,
        type: TransactionType.CREDIT
      }
    ]

    const mockSaveTransaction = {
      _id: "1",
      userFrom,
      userTo,
      pixTo,
      desc: "",
      value: 10,
      currency: "BRL",
      type: TransactionType.DEBIT
    }
    const userTransactionsAfterSave = [
      ...mockUserTransactions,
      mockSaveTransaction
    ];

    //spys
    const getUserTransactionSpy = jest.spyOn(service, "getUserTransactions")
      .mockResolvedValueOnce(mockUserTransactions)

    const findUserSpy = 
      jest.spyOn(usersService, "findUser")
        .mockResolvedValue({ ...userFrom})
        .mockResolvedValueOnce({ ...userTo})

    const saveTransactionSpy = 
      jest.spyOn(service, 'saveTransaction')
          .mockResolvedValueOnce(mockSaveTransaction)

    
    const res = service.createTransaction(transactionData, userFromId)
                  .catch(err => { throw new Error(err) });

    expect(res)
      .resolves
      .toEqual({
        transaction: mockSaveTransaction,
        balance: [
          {
            value: 90,
            currency: "BRL"
          }
        ]
      })
  })
});
