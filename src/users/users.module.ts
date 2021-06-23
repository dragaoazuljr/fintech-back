import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    TransactionsModule
  ],
  controllers: [UsersController],
  providers: [
    JwtAuthGuard,
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
