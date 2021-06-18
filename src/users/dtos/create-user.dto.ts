import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsAlphanumeric()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
	password: string;
}