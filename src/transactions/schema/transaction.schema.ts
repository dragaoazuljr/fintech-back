import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Pix } from "../../pix/schema/pix.schema";
import { User } from "../../users/schemas/user.schema";
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
	_id?: string;

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

	@Prop({ type: mongoose.Schema.Types.Date})
	timestamp?: Date;

	type?: TransactionType
} 

export enum TransactionType {
	DEBIT = "DEBIT",
	CREDIT = "CREDIT"
}

export const TransacionSchema = SchemaFactory.createForClass(Transaction);