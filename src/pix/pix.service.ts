import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreatePixKeyDto } from './dtos/create-pix-key.dto';
import { Pix, PixDocument } from './schema/pix.schema';

@Injectable()
export class PixService {
	constructor(
		@InjectModel(Pix.name) private pixModel: Model<PixDocument>,
		private _usersService: UsersService
	) {}

	getKeysByUserId(user: string): Promise<Pix[]> {
		return this.pixModel
			.find()
			.where('user')
			.equals(user)
			.exec()
	}

	async createPixKey(createPixKeyDto: CreatePixKeyDto, requestUserId: string) {
		const validUser = await this.validateCreatePixKey(createPixKeyDto, requestUserId);
		
		return this.savePixKey(createPixKeyDto, validUser);
	}

	async validateCreatePixKey(createPixKeyDto: CreatePixKeyDto, requestUserId: string): Promise<User> {
		const validUser = await this._usersService.findUser(requestUserId);
		if (!validUser) throw new BadRequestException('user does not exist');
		
		const existingKey = await this.getPixKeyByKey(createPixKeyDto.key);
		if (existingKey.length > 0) throw new BadRequestException('key already exist');

		const usersKeys = await this.getKeysByUserId(requestUserId);
		if (usersKeys.filter(pix => pix.label === createPixKeyDto.label).length > 0) throw new BadRequestException("a key with this label already exist");
		
		return validUser; 
	} 

	savePixKey(createPixKeyDto: CreatePixKeyDto, user: User): Promise<Pix> {
		const pixKey = new this.pixModel(createPixKeyDto);

		pixKey.user = user;

		return pixKey.save();		
	}

	getPixKeyByKey(key: string): Promise<Pix[]>{
		return this.pixModel
			.find({key})
			.lean()
			.populate('user')
			.exec()
	}

	async removePixKey(
		key: string,
		userId: string
	) {
		const usersKeys = await this.getKeysByUserId(userId);

		const pixKey = usersKeys.find(k => k.key === key);

		if(!pixKey) throw new BadRequestException("invalid pix key");

		return this.pixModel.findByIdAndDelete(pixKey._id)
	}
}
