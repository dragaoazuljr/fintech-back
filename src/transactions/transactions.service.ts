import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PixService } from '../pix/pix.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Balance } from './interfaces/Balance';
import { Transaction, TransactionType } from './schema/transaction.schema';
import * as _ from "lodash";
import { User } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class TransactionsService {

	constructor(
		@InjectModel(Transaction.name) private _transactionModel: Model<Transaction>,
		private _pixService: PixService,
		@Inject(forwardRef(() => UsersService)) private _usersService: UsersService
	) {}

	async createTransaction (
		createTransactionDto: CreateTransactionDto,
		userFromId: string
	) {
		//is userTo a valid user?

		const userTo = 
			await this._usersService.findUser(createTransactionDto.userTo)
				.catch(err => { throw new BadRequestException("Invalid userTo id")});

		if (!userTo) throw new NotFoundException("UserTo not found");

		// is userFrom a validUser

		const userFrom = 
			await this._usersService.findUser(userFromId)
				.catch(err => { throw new BadRequestException("invalud userFrom id")})

		if (!userFrom) throw new NotFoundException("UserFrom not found");

		//userFrom is diferrent from userTo

		if(userFromId === userTo._id.toString()) throw new BadRequestException("userTo should be diferent then userFrom")

		//valid pix key

		const pixTo = 
			await this._pixService.getPixKeyByKey(createTransactionDto.pixToKey)
				.catch(err => { throw new BadRequestException("invalid pix key") });

		if(!pixTo.length) throw new BadRequestException("userTo has no pix with this key");

		const pix = pixTo[0];

		if (pix.user._id.toString() !== createTransactionDto.userTo) throw new BadRequestException("pix key does not belongs to this user");

		//userFrom has sufficient balance to effetuate transaction?

		const userFromBalance = await this.getUserBalance(userFromId);

		const balanceCurrency = userFromBalance.find(balance => balance.currency === createTransactionDto.currency);

		if(!balanceCurrency) throw new BadRequestException("userFrom has no balance in this currency")
		if(createTransactionDto.value > balanceCurrency.value) throw new BadRequestException("insufficient balance to effectuate transaction")

		//create transaction model and save

		const transaction = 
			await this.saveTransaction(createTransactionDto, userFrom)
				.catch(err => { throw new InternalServerErrorException("error when saving transaction")})
		
		// get new Balance and return with transaction

		const balance = this.addTransactionToBalance(userFromBalance, this.addTransactionType(transaction, userFromId));

		return {
			transaction,
			balance
		}
	}

	async createInitialTransaction(createUserDto: CreateUserDto, userFromId: string) {
		const userFrom = await this._usersService.findUser(userFromId)
							.catch(err => { throw new BadRequestException("invalid userFrom id")});

		const createTransactionDto: CreateTransactionDto = {
			currency: createUserDto.currency,
			desc: "initial-transaction",
			pixToKey: "",
			userTo: userFromId,
			value: createUserDto.initialValue
		}

		this.saveTransaction(createTransactionDto, userFrom);
	}

	addTransactionToBalance(userFromBalance: Balance[], transaction: Transaction): Balance[] {
		return userFromBalance.map( balance => {
			if (transaction.currency !== balance.currency) return balance

			return {
				currency: transaction.currency,
				value: transaction.type === TransactionType.DEBIT ?
					balance.value - transaction.value :
					balance.value + transaction.value
			}
		})
	}

	saveTransaction(createTransactionDto: CreateTransactionDto, userFrom: User): Promise<Transaction> {
		const model = new this._transactionModel(createTransactionDto);
		const date = new Date();

		model.timestamp = date;
		model.userFrom = userFrom;

		return model.save()
	}
	
	async getUserBalance(userId: string): Promise<Balance[]> {
		const user = await this._usersService.findUser(userId)

		if(!user) throw new BadRequestException("getUserBalance: invalid userId");

		// filter transactions by user and calculate balance

		const transactions = await this.getUserTransactions(userId);

		const balances = this.calculateBalance(transactions)

		return balances
	}

	private calculateBalance(transactions: Transaction[]): Balance[] {
		// group transactions by type of currency
		const balanceCurrencies = _.groupBy(transactions, 'currency');

		//calculate balace for each type of currency
		const balances = this.calculateBalanceByCurrency(balanceCurrencies)

		return balances
	}

	calculateBalanceByCurrency(balanceCurrencies: _.Dictionary<Transaction[]>): Balance[] {
		const balances = Object.keys(balanceCurrencies).map(currency => {
			const value = 
				_.sumBy(balanceCurrencies[currency], 
					t => t.type === TransactionType.DEBIT ?
						-t.value :
						t.value)
			return {
				value,
				currency
			}
		})

		return balances
	}

	async getUserTransactions(userId: string, filterTransactionsBy?: TransactionType): Promise<Transaction[]>{
		const transactions = await this._transactionModel
										.find()
										.or([ {userFrom: userId}, {userTo: userId} ] as FilterQuery<Transaction>[])
										.populate('userTo', ['_id', 'name'])
										.populate('userFrom', ['_id', 'name'])
										.lean()
										.exec()

		const transactionsWithType = transactions
			.map(transaction => this.addTransactionType(transaction, userId))

		const filteredTransactions = filterTransactionsBy ?
			transactionsWithType.filter(transaction => transaction.type === filterTransactionsBy) :
			transactionsWithType

		return filteredTransactions
	}

	private addTransactionType(transaction, userId): Transaction {
		return {
			...transaction,
			type: transaction.userFrom._id.toString() === userId ? 
				( transaction.userTo._id.toString() === userId ?
				 TransactionType.CREDIT :
				 TransactionType.DEBIT ) :
				TransactionType.CREDIT
		}
	}
}
