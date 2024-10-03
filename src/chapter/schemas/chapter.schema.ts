import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Date } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";

export type ChaptersDocument = Chapters & Document;

@Schema({ collection: TABLE_NAMES.CHAPTER, timestamps: true })
export class Chapters {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TABLE_NAMES.TOPIC })
  topicId: string;

  @Prop({ type: Date })
  createdAt: Date

  @Prop({ type: Date })
  updatedAt: Date
}

export const ChaptersSchema = SchemaFactory.createForClass(Chapters);

ChaptersSchema.index({ topicId: 1 }); // Index for topicId
ChaptersSchema.index({ topicId: 1, name: 1 }); // Compound index for topicId and name

