import { Body, Controller, Get, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionType } from './schema/transaction.schema';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {

	constructor(
		private _transactionsService: TransactionsService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getTransactions(
		@Req() req: any,
		@Query('filterByTransactionType') filterByTransactionType: TransactionType
	) {
		const userId = req.user.userId;
		return this._transactionsService.getUserTransactions(userId, filterByTransactionType)
	}

	@UseGuards(JwtAuthGuard)
	@Get('balance')
	getBalance(
		@Req() req: any
	) {
		const userId = req.user.userId;
		return this._transactionsService.getUserBalance(userId);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post()
	createTransaction (
		@Body() createTransactionDto: CreateTransactionDto,
		@Req() req: any
	) {
		const userId = req.user.userId;
		return this._transactionsService.createTransaction(createTransactionDto, userId)
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post("/initial")
	createInitialTransaction(
		@Body() createUserDto: CreateUserDto,
		@Req() req: any
	) {
		const userId = req.user.userId;
		return this._transactionsService.createInitialTransaction(createUserDto, userId);
	}
}
