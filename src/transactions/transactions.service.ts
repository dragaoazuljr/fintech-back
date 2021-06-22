import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PixService } from '../pix/pix.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionsService {

	constructor(
		@InjectModel(Transaction.name) private _transactionModel: Model<Transaction>,
		private _pixService: PixService,
		private _usersService: UsersService
	) {}

	async createTransaction (
		createTransactionDto: CreateTransactionDto
	) {
		//is userTo a valid user?

		const userTo = 
			await this._usersService.findUser(createTransactionDto.userTo)
				.catch(err => { throw new BadRequestException("Invalid userTo id")});

		if (!userTo) throw new BadRequestException("UserTo not found");

		//valid pix key

		const pixTo = 
			await this._pixService.getPixKeyByKey(createTransactionDto.pixToKey)
				.catch(err => { throw new BadRequestException("invalid pix key") });

		if(!pixTo.length) throw new BadRequestException("invalid pix key");

		const pix = pixTo[0];

		if (pix.user._id !== createTransactionDto.userTo) throw new BadRequestException("pix key does not belongs to this user");

		//userFrom has sufficient founds to effetuate transaction?

		//create transaction model and save
	}
}
