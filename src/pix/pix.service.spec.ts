import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMockClassService } from '../users/mocks/user-service.mock';
import { UsersService } from '../users/users.service';
import { CreatePixKeyDto } from './dtos/create-pix-key.dto';
import { PixSchemaModelMock } from './mocks/pix-schema-model.mock';
import { PixService } from './pix.service';
import { Pix } from './schema/pix.schema';

describe('PixService', () => {
  let service: PixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PixService,
        { provide: getModelToken(Pix.name), useClass: PixSchemaModelMock },
        UsersService
      ],
    })
    .overrideProvider(UsersService)
    .useClass(UserMockClassService)
    .compile();

    service = module.get<PixService>(PixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it("should not create duplicate pix key", () => {
    const pixData = {
      user: "1",
      key: "user@email.com",
      label: "email"
    };

    expect(service.createPixKey(pixData, "1"))
      .rejects
      .toThrow(BadRequestException)
  })

  it("should not create pix key with a invalid user", () => {
    const pixData = {
      key: "user@otheremail.com",
      label: "office-email"
    } as CreatePixKeyDto

    expect(service.createPixKey(pixData, "1"))
      .rejects
      .toThrow(BadRequestException)
  })

  it("should create key with same label", () => {
    const pixData =  {
      user: "1",
      key: "user@otheremail.com",
      label: "email"
    }

    expect(service.createPixKey(pixData, "1"))
      .rejects
      .toThrow(BadRequestException)
  })
  
  it("should not create pix key when request user is different from payload", () => {
    const pixData = {
      user: "1",
      key: "user@otheremail.com",
      label: "email"     
    };

    expect(service.createPixKey(pixData, "2"))
      .rejects
      .toThrow(BadRequestException)
  })
  
  it("should create pix key", async () => {
    const pixData = {
      user: "1",
      key: "user@otheremail.com",
      label: "office-email"
    }
    
    expect(service.createPixKey(pixData, "1"))
      .toBeTruthy();
  })
  
  it("should list all pix keys by userId", async () => { 
    const _id = "1";
    
    const keys = await service.getKeysByUserId(_id);
    
    expect(keys)
      .toHaveLength(1)
  })

  it("should not remove invalid pix key", () => {
    const key = "invalid-key";
    const userId = "1";

    expect(service.removePixKey(key, userId))
    .rejects
    .toThrow(BadRequestException)
  })
  
  it("should remove pix key", () => {
    const key = "user@email.com"
    const userId = "1";

    expect(service.removePixKey(key, userId))
      .toBeTruthy()
  })

  // it("should should search user by pix key", () => { })
});
