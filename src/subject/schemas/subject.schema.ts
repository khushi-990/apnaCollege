import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Date } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";

export type SubjectsDocument = Subjects & Document;

@Schema({ collection: TABLE_NAMES.SUBJECT, timestamps: true })
export class Subjects {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({type: Date})
  createdAt: Date

  @Prop({type: Date})
  updatedAt: Date
}

export const SubjectsSchema = SchemaFactory.createForClass(Subjects);
