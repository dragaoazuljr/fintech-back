import { BadRequestException, Body, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		private _userService: UsersService,
		private _transactionsService: TransactionsService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAllUsers(){
		return this._userService.getAllUsers()
	}

	@Get(':_id')
	async findUser(
		@Param('_id') _id: string
	) {
		return this._userService.findUser(_id);
	}

	@Post()
	@UsePipes(ValidationPipe)
	async createUser (
		@Body() createUserDto: CreateUserDto
	) {
		const user = 
			await this._userService.createUser(createUserDto)
				.catch(err => { throw new BadRequestException(err)});

		if(!createUserDto.initialValue) return user

		await this._transactionsService.createInitialTransaction(createUserDto, user._id.toString())

		return user
	}
}
