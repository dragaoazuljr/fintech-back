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
			name: 'jwtStrategy',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			algorithms: ['RS256'],
			secret: _configService.get("JWT_SECRET")
		})
	}
}