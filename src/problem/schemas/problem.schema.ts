import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Date } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";
import { LevelEnum } from "../enum/Level.enum";

export type PromblemsDocument = Promblems & Document;

@Schema({ collection: TABLE_NAMES.PROBLEM, timestamps: true })
export class Promblems {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TABLE_NAMES.CHAPTER })
  chapterId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, enum: LevelEnum, required: true })
  level: LevelEnum;

  @Prop({ required: true })
  leetcodeorCodeforceLink?: string;

  @Prop({ required: false })
  youtubeLink?: string;

  @Prop({ required: false })
  articleLink?: string;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
  
}

// Create the schema
export const PromblemsSchema = SchemaFactory.createForClass(Promblems);

// Add Indexes
PromblemsSchema.index({ chapterId: 1 }); // Index for chapterId
PromblemsSchema.index({ level: 1 }); // Index for filtering based on level
PromblemsSchema.index({ createdAt: -1 }); // Index for sorting by createdAt
PromblemsSchema.index({ title: "text" }); // Text index for title search
PromblemsSchema.index({ chapterId: 1, level: 1, createdAt: -1 }); // Compound index for chapterId, level, and sorting by createdAt
