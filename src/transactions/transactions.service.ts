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

	async validateTransaction (createTransactionDto: CreateTransactionDto, userId: string): Promise<{
		createTransactionDto: CreateTransactionDto,
		userFrom: User,
		userFromBalance: Balance[]
	}> {
		const userFrom = await this._usersService.findUser(userId);
		const userTo = await this._usersService.findUser(createTransactionDto.userTo);		

		if(!userFrom) throw new BadRequestException("invalid userId");
		if(!userTo) throw new BadRequestException("invalid userTo");
		if(userFrom._id.toString() === userTo._id.toString()) throw new BadRequestException("userTo should be different from userFrom");
				
		const pixTo = await this._pixService.getPixKeyByKey(createTransactionDto.pixToKey);

		if(!pixTo.length) throw new BadRequestException("invalid pix key");

		const pix = pixTo[0];

		if (pix.user._id.toString() !== createTransactionDto.userTo) throw new BadRequestException("pix key does not belongs to this user");

		const userFromBalance = await this.getUserBalance(userId);

		const balanceCurrency = userFromBalance.find(balance => balance.currency === createTransactionDto.currency);

		if(!balanceCurrency) throw new BadRequestException("userFrom has no balance in this currency");

		if(createTransactionDto.value > balanceCurrency.value) throw new BadRequestException("insufficient balance to effectuate transaction");

		return {createTransactionDto, userFrom, userFromBalance};
	}
			
	async createTransaction (
		createTransactionDto: CreateTransactionDto,
		userFromId: string
	) {

		const { userFrom, userFromBalance } = await this.validateTransaction(createTransactionDto, userFromId);		//create transaction model and save

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
										.sort({ timestamp: -1})
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

	private sortTransactions(a: Transaction, b: Transaction){
		if (a.timestamp > b.timestamp) return 1;
		if (a.timestamp < b.timestamp) return -1;
		return 0;
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
