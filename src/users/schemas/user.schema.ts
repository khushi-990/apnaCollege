import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Date } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";
import { GenderEnum, UserTypeEnum } from "../enum/User.enum";

export type UsersDocument = Users & Document;

@Schema({ collection: TABLE_NAMES.USER, timestamps: true })
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Number, enum: GenderEnum, required: true })
  gender: GenderEnum;
  
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({required:false, default: []})
  progress: string[];

  @Prop({required:true,type:Number, enum: UserTypeEnum, default: 1})
  userType: UserTypeEnum;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: TABLE_NAMES.PROBLEM, default: [] })
  completedProblems: mongoose.Types.ObjectId[];

  @Prop({type: Date})
  createdAt: Date

  @Prop({type: Date})
  updatedAt: Date
}

export const UsersSchema = SchemaFactory.createForClass(Users);
