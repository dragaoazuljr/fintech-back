import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {

	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {}

	async createUser(
		createUserDto: CreateUserDto
	) {
		const userAlreadyExist = await this.findUserByLogin(createUserDto.email)

		if (userAlreadyExist) throw new BadRequestException('user already exist');

		const userCreated = new this.userModel(createUserDto);

		return await userCreated.save();
	}

	findUserByLogin( login: string ) {
		return this.userModel.find({ login }).exec();
	}

	findUser(
		_id: string		
	) {
		return this.userModel.findById(_id).exec()
	}
}
