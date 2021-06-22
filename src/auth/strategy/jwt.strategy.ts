import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (
		private _configService: ConfigService
	) {
		super ({
			name: 'jwt',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: _configService.get("JWT_SECRET")
		})
	}

	async validate(payload: any): Promise<any> {
		return { userId: payload.sub, username: payload.email };
	}
}