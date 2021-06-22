import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PixService } from '../pix/pix.service';
import { Pix, PixSchema } from '../pix/schema/pix.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { TransacionSchema, Transaction } from './schema/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransacionSchema }]),
    MongooseModule.forFeature([{ name: Pix.name, schema: PixSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    JwtAuthGuard,
    UsersService,
    PixService
  ]
})
export class TransactionsModule {}
