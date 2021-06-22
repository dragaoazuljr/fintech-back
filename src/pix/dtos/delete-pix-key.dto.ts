import { IsNotEmpty } from "class-validator";

export class DeletePixKeyDto {
	@IsNotEmpty()
	key: string
}