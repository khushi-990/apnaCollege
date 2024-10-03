import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Date } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";

export type TopicsDocument = Topics & Document;

@Schema({ collection: TABLE_NAMES.TOPIC, timestamps: true })
export class Topics {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'table_subject' })
  subjectId: string;

  @Prop({ type: Date })
  createdAt: Date

  @Prop({ type: Date })
  updatedAt: Date
}

export const TopicsSchema = SchemaFactory.createForClass(Topics);
