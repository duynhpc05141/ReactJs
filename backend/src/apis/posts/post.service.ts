import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import FirebaseService from 'src/providers/storage/firebase/firebase.service';
import { Media, MediaType, Posts, Reply, Topic } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Readable } from 'stream';
import { getMimeTypeCategory } from 'src/utils/mimeTypeUtils';
import { updatePostDto } from './dto/update-post.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpStatus } from 'src/global/globalEnum';
import { CreateReplyDto } from './dto/create-reply.dto';
import { updateReplyDto } from './dto/update-reply.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { generateSlug } from 'src/utils/generateSlug';
import { updateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Posts.name)
    private readonly postModel: Model<Posts>,
    @InjectModel(Reply.name)
    private readonly replyModel: Model<Reply>,
    @InjectModel(Media.name)
    private readonly mediaModel: Model<Media>,
    @InjectModel(Topic.name)
    private readonly topicModel: Model<Topic>,
    private readonly firebaseService: FirebaseService,
  ) {}
  // Post service
  async createPost(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<Posts> {
    try {
     
      const mediaPromises = files.map(async (file) => {
        const fileStream = Readable.from(file.buffer);
        const type = getMimeTypeCategory(file.mimetype);
        const mediaType = type === 'IMAGE' ? MediaType.IMAGE : MediaType.VIDEO;
  
        const mediaUrl = await this.firebaseService.uploadImageToFirebase(
          file.buffer,
          file.originalname,
          mediaType,
        );
        const media = new this.mediaModel({
          url: mediaUrl,
          type: mediaType,
        });
        return media.save();
      });
      const savedMediaArray = await Promise.all(mediaPromises);
  
   
      const replyIds = createPostDto.reply || []; 
  
   
      const post = new this.postModel({
        ...createPostDto,
        media: savedMediaArray.map((media) => media._id),
        reply: replyIds, 
        date: new Date(),
      });
  
      return await post.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating post',
        error.message,
      );
    }
  }
  
  
  

  async updatePost(
    id: string,
    updatePostDto: updatePostDto,
    files?: Express.Multer.File[],
  ): Promise<Posts> {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      Object.assign(post, updatePostDto);
      if (files && files.length > 0) {
        const mediaPromises = files.map(async (file) => {
          const fileStream = Readable.from(file.buffer);
          const type = getMimeTypeCategory(file.mimetype);
          const mediaType =
          type === 'IMAGE' ? MediaType.IMAGE : MediaType.VIDEO;
          const mediaUrl = await this.firebaseService.uploadImageToFirebase(
            file.buffer,
            file.originalname,
            mediaType,
          );
         
          const media = new this.mediaModel({
            url: mediaUrl,
            type: mediaType,
          });
          return media.save();
        });
        const savedMediaArray = await Promise.all(mediaPromises);
        post.media = savedMediaArray.map((media) => media._id);
      }
      return await post.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating post',
        error.message,
      );
    }
  }
  async updateReportPost(
    id: string,
    updatePostDto: { hide: boolean }, 
    files?: Express.Multer.File[],
  ): Promise<Posts> {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
  
     
      if (updatePostDto.hide !== undefined) {
        post.hide = updatePostDto.hide;
      }
  
      if (files && files.length > 0) {
        const mediaPromises = files.map(async (file) => {
          const fileStream = Readable.from(file.buffer);
          const type = getMimeTypeCategory(file.mimetype);
          const mediaType =
            type === 'IMAGE' ? MediaType.IMAGE : MediaType.VIDEO;
          const mediaUrl = await this.firebaseService.uploadImageToFirebase(
            file.buffer,
            file.originalname,
            mediaType,
          );
  
          const media = new this.mediaModel({
            url: mediaUrl,
            type: mediaType,
          });
          return media.save();
        });
        const savedMediaArray = await Promise.all(mediaPromises);
      }
  
      return await post.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating post',
        error.message,
      );
    }
  }
  async searchPostsByTitle(searchQuery: string): Promise<Posts[]> {
    try {
      let query: any = {};
  
      if (searchQuery) {
        query = { ...query, title: { $regex: searchQuery, $options: 'i' } };
      }
  
      return this.postModel
        .find(query)
        .exec();
    } catch (error) {
      console.error('Error searching posts by title:', error);
      throw new InternalServerErrorException('Error searching posts by title');
    }
  }

  async findAllPost(): Promise<Posts[]> {
    return  this.postModel.find().populate('topic').populate('user').populate('media').populate('reply').exec();
  }
  async findPostById(id: string): Promise<Posts> {
    const post = await this.postModel.findById(id).populate('topic').populate('user').populate('reply').populate('media').exec();
    if (!post) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return post;
  }

  async deletePostById(id: string): Promise<ResponseData<Posts>> {
    try {
      const post = await this.postModel.findByIdAndDelete(id).exec();

      if (!post) {
        return new ResponseData<Posts>([], HttpStatus.ERROR, 'Post not found');
      }
      const res = await this.postModel.findByIdAndDelete(id);
      return new ResponseData<Posts>(
        [],
        HttpStatus.SUCCESS,
        'Delete Post successfully',
      );
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  //Reply service

  async createReply(postId: string, createReplyDto: CreateReplyDto, files: Express.Multer.File[]): Promise<Reply> {
    try {
      // Xử lý các file media
      const mediaPromises = files.map(async (file) => {
        const fileStream = Readable.from(file.buffer);
        const type = getMimeTypeCategory(file.mimetype);
        const mediaType = type === 'IMAGE' ? MediaType.IMAGE : MediaType.VIDEO;

        const mediaUrl = await this.firebaseService.uploadImageToFirebase(
          file.buffer,
          file.originalname,
          mediaType,
        );
        const media = new this.mediaModel({
          url: mediaUrl,
          type: mediaType,
        });
        return media.save();
      });
      const savedMediaArray = await Promise.all(mediaPromises);

      // Tạo reply và lưu vào cơ sở dữ liệu
      const reply = new this.replyModel({
        ...createReplyDto,
        media: savedMediaArray.map((media) => media._id),
        date: new Date(),
      });
      const savedReply = await reply.save();

      // Cập nhật bài viết với ID của reply
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      post.reply = [...post.reply, savedReply._id];
      await post.save();

      return savedReply;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating reply',
        error.message,
      );
    }
  }

  async updateReply(
    id: string,
    updateReplyDto: updateReplyDto,
    files?: Express.Multer.File[],
  ): Promise<Reply> {
    try {
      const reply = await this.replyModel.findById(id);
      if (!reply) {
        throw new NotFoundException('Reply not found');
      }
      Object.assign(reply, updateReplyDto);
      if (files && files.length > 0) {
        const mediaPromises = files.map(async (file) => {
          const type = getMimeTypeCategory(file.mimetype);
          const mediaType = type === 'IMAGE' ? MediaType.IMAGE : MediaType.VIDEO;
          const mediaUrl = await this.firebaseService.uploadImageToFirebase(
            file.buffer,
            file.originalname,
            mediaType,
          );
          const media = new this.mediaModel({
            url: mediaUrl,
            type: mediaType,
          });
          return media.save();
        });
        const savedMediaArray = await Promise.all(mediaPromises);
        reply.media = savedMediaArray.map((media) => media._id);
      }
      return await reply.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating reply',
        error.message,
      );
    }
  }
  async findAllReply(): Promise<Reply[]> {
    try {
      return  this.replyModel.find().populate('media');
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw new Error('Error fetching replies');
    }
  }
  async findReplyById(id: string): Promise<Reply> {
    const reply = await this.replyModel.findById(id).populate('media').exec();
    if (!reply) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return reply;
  }

  async deleteReplyById(id: string): Promise<ResponseData<Reply>> {
    try {
      const post = await this.replyModel.findByIdAndDelete(id).exec();

      if (!post) {
        return new ResponseData<Reply>([], HttpStatus.ERROR, 'Reply not found');
      }
      const res = await this.replyModel.findByIdAndDelete(id);
      return new ResponseData<Reply>(
        [],
        HttpStatus.SUCCESS,
        'Delete reply successfully',
      );
    } catch (error) {
      console.error('Error deleting Reply:', error);
      throw error;
    }
  }

  //Topic service 
  async createTopic(Topic: CreateTopicDto): Promise<Topic> {
    try {
        Topic.slug = generateSlug(Topic.name);

        const res = await this.topicModel.create(Topic);
        return res;
    } catch (error) {
        console.error('Error create child topic:', error);
        throw error;
    }
}

// Update Topic By Id
async updateTopic(topic: updateTopicDto, id: string): Promise<Topic> {
    try {
        topic.slug = generateSlug(topic.name);

        const res = await this.topicModel.findByIdAndUpdate(id, topic);
        return res;
    } catch (error) {
        console.error('Error create topic:', error);
        throw error;
    }
}

// Find All Topics
async findAllTopics(): Promise<Topic[]> {
    const topics = await this.topicModel.find().exec();
    return topics;
}

// Find Topic By Id
async findTopicById(id: string): Promise<Topic> {
    try {
        const res = await this.topicModel.findById(id);
        return res;
    } catch (error) {
        console.error('Error create topic:', error);
        throw error;
    }
}

// Delete Topic by id
async deleteTopicById(id: string): Promise<ResponseData<Topic>> {


    try {
        const Topic = await this.topicModel.findById(id);
        if (!Topic) {
            return new ResponseData<Topic>(
                [],
                HttpStatus.ERROR,
                'Topic not found'
            );
        }
        const res = await this.topicModel.findByIdAndDelete(id);
        return  new ResponseData<Topic>(
            [],
            HttpStatus.SUCCESS,
            'Delete topic successfully'
        );;
    } catch (error) {
        console.error('Error deleting child topic:', error);
        throw error;
    }   
}


async addTopicToPost(postId: string, topicId: string): Promise<Posts> {
  const post = await this.postModel.findById(postId);

  if (!post) {
    throw new InternalServerErrorException(
      `Post with ID ${postId} not found`,
    );
  }

  const topic = await this.topicModel.findById(topicId);

  if (!topic) {
    throw new InternalServerErrorException(
      `Topic with ID ${topicId} not found`,
    );
  }
  if (post.topic.includes(topicId)) {
    throw new InternalServerErrorException(
      `Topic with ID ${topicId} is already added to the post`,
    );
  }
  post.topic.push(topicId);
  return post.save();
}

async addTopicToReply(replyId: string, topicId: string): Promise<Reply> {
  const reply = await this.replyModel.findById(replyId);

  if (!reply) {
    throw new InternalServerErrorException(
      `Reply with ID ${replyId} not found`,
    );
  }

  const topic = await this.topicModel.findById(topicId);

  if (!topic) {
    throw new InternalServerErrorException(
      `Topic with ID ${topicId} not found`,
    );
  }
  if (reply.topic.includes(topicId)) {
    throw new InternalServerErrorException(
      `Topic with ID ${topicId} is already added to the post`,
    );
  }
  reply.topic.push(topicId);
  return reply.save();
}
}