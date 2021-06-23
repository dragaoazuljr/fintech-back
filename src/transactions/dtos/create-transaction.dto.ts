import { IsAlpha, IsNotEmpty, IsNumber, IsUppercase, Length, MinLength } from "class-validator";

export class CreateTransactionDto {
	@IsNotEmpty()
	userTo: string;

	@IsNotEmpty()
	pixToKey: string;

	@IsNotEmpty()
	@IsNumber()
	value: number;

	@IsNotEmpty()
	@IsUppercase()
	@IsAlpha('pt-BR', {message: "currency must contains only letters"})
	@Length(3, 3, {message: "invalid currency"})
	currency: string;
	
	desc: string;
}