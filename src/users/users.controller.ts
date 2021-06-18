import { Body, Param, Post } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		private _userService: UsersService
	) {}

	@Get(':_id')
	async findUser(
		@Param('_id') _id: string
	) {
		return this._userService.findUser(_id);
	}

	@Post()
	async createUser (
		@Body() createUserDto: CreateUserDto
	) {
		return this._userService.createUser(createUserDto)
	}
}
