import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dtos/login-user.dto';
import { LocalAuthGuard } from './strategy/local-auth.guard';

@Controller('auth')
export class AuthController {
	@UseGuards(LocalAuthGuard)
	@Post('/login')
	async login(@Request() req) {
		return req.user
	}
}
