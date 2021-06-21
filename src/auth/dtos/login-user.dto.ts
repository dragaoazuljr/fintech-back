import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
	@IsNotEmpty()
	email: string

	@IsNotEmpty()
	passoword: string;
}