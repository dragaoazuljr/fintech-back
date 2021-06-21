import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dtos/login-user.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ username: 'email', password: 'password'});
	}

	async validate(email: string, password: string): Promise<any> {
		const user = {} // this.authService.validateUser(email, password);

		if (!user) throw new UnauthorizedException();

		return user
	}
}