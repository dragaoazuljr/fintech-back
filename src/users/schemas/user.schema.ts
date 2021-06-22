import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
	_id: string

	@Prop()
	name: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);