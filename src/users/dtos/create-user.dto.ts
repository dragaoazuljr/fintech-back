import { IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty, IsString, IsUppercase, Length, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
	password: string;

	initialValue?: number

	@IsNotEmpty()
	@IsUppercase()
	@IsAlpha('pt-BR', {message: "currency must contains only letters"})
	@Length(3, 3, {message: "invalid currency"})
	@ValidateIf((obj: CreateUserDto) => !!obj.initialValue)
	currency?: string
}