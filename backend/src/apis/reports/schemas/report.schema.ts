import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true })
  post: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: 'ObjectId', ref: 'User' })
  updatedBy?: string;
  @Prop({ type: Date, default: Date.now })
  reportedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
