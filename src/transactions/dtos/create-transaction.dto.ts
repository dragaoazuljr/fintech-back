import { IsAlpha, IsNotEmpty, IsNumber, Length, MinLength } from "class-validator";

export class CreateTransactionDto {
	@IsNotEmpty()
	userTo: string;

	@IsNotEmpty()
	pixToKey: string;

	@IsNotEmpty()
	@IsNumber()
	value: number;

	@IsNotEmpty()
	@IsAlpha()
	@Length(3, 3, {message: "invalid currency"})
	currency: string;
	
	desc: string;
}