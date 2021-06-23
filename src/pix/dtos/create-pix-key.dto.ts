import { IsAlphanumeric, IsNotEmpty, Matches } from "class-validator";

export class CreatePixKeyDto {
	@IsNotEmpty()
	@Matches(/^[0-9a-fA-F]{24}$/)
	user: string;

	@IsNotEmpty()
	key: string;

	@IsNotEmpty()
	label: string;
}