import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UploadedFiles,
  Get,
  Param,
  Put,
  InternalServerErrorException,
  Delete,
  Query,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { PostService } from './post.service';
import { Posts, Reply, Topic } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { updatePostDto } from './dto/update-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { updateReplyDto } from './dto/update-reply.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}


    // Topic Controller
    // Create Topic route
    @Post('/create-topic')
    async createTopic(@Body() topic: Topic): Promise<ResponseData<Topic>> {
        try {
            const saveTopic = await this.postService.createTopic(topic);
            return new ResponseData<Topic>(
                saveTopic,
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            return new ResponseData<Topic>(
                null,
                HttpStatus.ERROR,
                HttpMessage.ERROR,
            );
        }
    }

    // Update Topic route
    @Put('/update-topic/:id')
    async updateTopic(
        @Body() topic: Topic,
        @Param('id') id: string,
    ): Promise<ResponseData<Topic>> {
        try {
            const saveTopic = await this.postService.updateTopic(topic, id);
            return new ResponseData<Topic>(
                saveTopic,
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            return new ResponseData<Topic>(
                null,
                HttpStatus.ERROR,
                HttpMessage.ERROR,
            );
        }
    }

    // get Topic by id route
    @Get('topic/:id')
    async findTopicById(@Param('id') id: string): Promise<ResponseData<Topic>> {
        try {
            const saveTopic = await this.postService.findTopicById(id);
            return new ResponseData<Topic>(
                saveTopic,
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            return new ResponseData<Topic>(
                null,
                HttpStatus.ERROR,
                HttpMessage.ERROR,
            );
        }
    }

    // Get alll Topic route
    @Get('topic')
    async findAllTopic(): Promise<ResponseData<Topic[]>> {
        try {
            const saveTopics = await this.postService.findAllTopics();
            return new ResponseData<Topic[]>(
                saveTopics,
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            console.error('Error fetching topics:', error);
            return new ResponseData<Topic[]>(
                null,
                HttpStatus.ERROR,
                HttpMessage.ERROR,
            );
        }
    }

    // Delete Topic route
    @Delete('topic/:id')
    async deleteTopicById(
        @Param('id') id: string,
    ): Promise<ResponseData<Topic>> {
        return await this.postService.deleteTopicById(id);

    }

    @Post('add-topic/:id/')
    async addTopicToPost(
      @Param('id') postId: string,
      @Body('topicId') topicId: string,
    ) {
      return this.postService.addTopicToPost(postId, topicId);
    }
    @Post('reply/add-topic/:id/')
    async addTopicToReply(
      @Param('id') replyId: string,
      @Body('topicId') topicId: string,
    ) {
      return this.postService.addTopicToReply(replyId, topicId);
    }
  // Post controller
  @Get('search')
  async searchPostsByTitle(@Query('title') title: string): Promise<any> {
    try {
      if (!title) {
        return new ResponseData<Posts>(
          [],
          HttpStatus.SUCCESS,
          'No title provided for search'
        );
      }
  
      const posts = await this.postService.searchPostsByTitle(title);
      console.log('Filtered posts:', posts); 
      return new ResponseData<Posts>(
        posts,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Posts>(
        null,
        HttpStatus.ERROR,
        'Error searching posts by title'
      );
    }
  }

  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 10 }]))
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: { media?: Express.Multer.File[] },
  ): Promise<Posts> {
    return this.postService.createPost(createPostDto, files.media);
  }
  @Get()
  async getAllPost(): Promise<ResponseData<Posts[]>> {
    try {
      const courses = await this.postService.findAllPost();
      return new ResponseData<Posts[]>(
        courses,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Posts[]>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Put('update/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 10 }]))
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: updatePostDto,
    @UploadedFiles() files: { media?: Express.Multer.File[] },
  ): Promise<Posts> {
    try {
      return await this.postService.updatePost(id, updatePostDto, files.media);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating post',
        error.message,
      );
    }
  }
  @Put('update-report/:id')
  async updateReportPost(
    @Param('id') id: string,
    @Body() updatePostDto: { hide: boolean }, 
  ): Promise<Posts> {
    try {
      return await this.postService.updateReportPost(id, updatePostDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating post',
        error.message,
      );
    }
  }
  
  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<ResponseData<Posts>> {
    try {
      const courses = await this.postService.findPostById(id);
      return new ResponseData<Posts>(
        courses,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Posts>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Delete(':id')
  removeCourse(@Param('id') id: string) {
    return this.postService.deletePostById(id);
  }

  //Reply controller
  @Post('replies/:postId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 10 }]))
  async createReply(
    @Param('postId') postId: string,
    @Body() createReplyDto: CreateReplyDto,
    @UploadedFiles() files: { media?: Express.Multer.File[] },
  ): Promise<Reply> {
    try {
      return await this.postService.createReply(
        postId,
        createReplyDto,
        files.media,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating reply',
        error.message,
      );
    }
  }

  @Put('replies/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 10 }]))
  async updateReply(
    @Param('id') id: string,
    @Body() updateReplyDto: updateReplyDto,
    @UploadedFiles() files: { media?: Express.Multer.File[] },
  ): Promise<Reply> {
    try {
      return await this.postService.updateReply(
        id,
        updateReplyDto,
        files.media,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating reply',
        error.message,
      );
    }
  }

  @Get('replies')
  async getAllReply(): Promise<ResponseData<Reply[]>> {
    try {
      const replies = await this.postService.findAllReply();
      return new ResponseData<Reply[]>(
        replies,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Reply[]>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Get('replies/:id')
  async getReplyById(@Param('id') id: string): Promise<ResponseData<Reply>> {
    try {
      const courses = await this.postService.findReplyById(id);
      return new ResponseData<Reply>(
        courses,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Reply>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Delete('replies/:id')
  removeReply(@Param('id') id: string) {
    return this.postService.deleteReplyById(id);
  }
}