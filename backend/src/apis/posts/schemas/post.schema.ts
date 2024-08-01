import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MediaDocument = Media & Document;

export enum MediaType {
  IMAGE = 'images',
  VIDEO = 'video',
}
@Schema({ timestamps: true })
export class Topic {
    @Prop({ type: String })
    name: string;
    @Prop({ type: String })
    slug: string;
    
    @Prop({ type: String })
    description: string;
}
export const TopicSchema = SchemaFactory.createForClass(Topic);

@Schema({ timestamps: true })
export class Media {
  @Prop()
  url: string;

  @Prop({ type: String, enum: MediaType })
  type: MediaType;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
export type PostsDocument = Posts & Document;

@Schema({ timestamps: true })
export class Posts {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ])
  comment: mongoose.Schema.Types.ObjectId[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
  ])
  reply: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: String })
  slug: string;
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ])
  topic: mongoose.Schema.Types.ObjectId[];
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
  ])
  media: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const PostSchema = SchemaFactory.createForClass(Posts);



@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ])
  comment: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String })
  slug: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
  ])
  media: mongoose.Schema.Types.ObjectId[];
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ])
  topic: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);


