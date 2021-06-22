import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "../../users/schemas/user.schema";

export type PixDocument = Pix & Document;

@Schema()
export class Pix {

	_id: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User"})
	user: User

	@Prop({ unique: true })
	key: string;

	@Prop()
	label: string;
}

export const PixSchema = SchemaFactory.createForClass(Pix);