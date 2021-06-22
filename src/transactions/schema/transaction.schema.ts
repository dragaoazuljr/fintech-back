import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Pix } from "../../pix/schema/pix.schema";
import { User } from "../../users/schemas/user.schema";
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
	_id: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
	userFrom: User

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
	userTo: User

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Pix"})
	pixTo: Pix

	@Prop()
	desc: string;

	@Prop()
	value: number;

	@Prop()
	currency: string;
} 

export const TransacionSchema = SchemaFactory.createForClass(Transaction);