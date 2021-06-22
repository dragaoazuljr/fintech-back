import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
		if (requestUserId !== createPixKeyDto.user) throw new BadRequestException("invalid payload userId")

		const existingKey = await this.getPixKeyByKey(createPixKeyDto.key)

		if (existingKey.length > 0) throw new BadRequestException('key already exist');

		if (!createPixKeyDto.user) throw new BadRequestException("empty user id");

		const validUser = await 
			this._usersService.findUser(createPixKeyDto.user)
				.catch(err => { throw new BadRequestException("invalid userId") });;

		if (!validUser) throw new BadRequestException('user does not exist');

		const userKeys = await this.getKeysByUserId(createPixKeyDto.user);

		if (userKeys.filter(pix => pix.label === createPixKeyDto.label).length > 0) throw new BadRequestException("a key with this label already exist");

		const pixKey = new this.pixModel(createPixKeyDto);

		return pixKey.save();
	}

	getPixKeyByKey(key: string){
		return this.pixModel.find({key}).lean().exec()
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
