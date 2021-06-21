import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {

	constructor(
		private _usersService: UsersService
	) { }

	async validateUser(email: string, password: string) {
		const user = await this._usersService.findUserByLogin(email);

		if (user && user.password === password) {
			const { password, ...result } = user;

			return result;
		}

		return null;
	}
}
