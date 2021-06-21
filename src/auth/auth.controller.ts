import { Body, Controller, Request, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
	
	constructor(
		private _authService: AuthService
	) { }
	
	@Post('/login')
	@UsePipes(ValidationPipe)
	async login(@Body() loginUserDto: LoginUserDto) {
		return this._authService.login(loginUserDto);
	}
}
