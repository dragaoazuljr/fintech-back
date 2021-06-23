import { Body, Controller, Post, UseGuards, Request, Get, Delete, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePixKeyDto } from './dtos/create-pix-key.dto';
import { DeletePixKeyDto } from './dtos/delete-pix-key.dto';
import { SearchPixKeysDto } from './dtos/search-pix-key.dto';
import { PixService } from './pix.service';

@Controller('pix')
export class PixController {
	constructor(
		private _pixService: PixService
	) { }

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post()
	createPixKey(
		@Body() createPixKeyDto: CreatePixKeyDto,
		@Request() req: any
	) {
		const requestUserId = req.user.userId;
		return this._pixService.createPixKey(createPixKeyDto, requestUserId)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getPixKeys(
		@Request() req: any
	) {
		const requestUserId = req.user.userId;

		return this._pixService.getKeysByUserId(requestUserId)
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Delete()
	deletePixKey(
		@Body() deletePixKeyDto: DeletePixKeyDto,
		@Request() req: any
	) {
		const userId = req.user.userId;

		return this._pixService.removePixKey(deletePixKeyDto.key, userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('search')
	searchPixKeys(
		@Body() searchPixKeysDto: SearchPixKeysDto
	) {
		return this._pixService.getPixKeyByKey(searchPixKeysDto.key);
	}
}
