import { IsAlphanumeric, IsNotEmpty, Matches } from "class-validator";

export class CreatePixKeyDto {
	@IsNotEmpty()
	key: string;

	@IsNotEmpty()
	label: string;
}