import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {

	constructor(
		private _usersService: UsersService,
		private _jwtService: JwtService
	) { }

	async validateUser(loginUserDto: LoginUserDto) {
		const user = await this._usersService.findUserByLogin(loginUserDto.email);

		if (user && user.password === loginUserDto.password) {
			const {password, ...rest} = user
			return rest
		}

		return null;
	}

	async login (loginUserDto: LoginUserDto) {
		const validUser = await this.validateUser(loginUserDto)

		if (!validUser) throw new UnauthorizedException();
 
		const payload = { email: validUser.email, sub: validUser._id};

		return {
			access_token: this._jwtService.sign(payload)
		}
	}
}
