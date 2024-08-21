import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report } from '../reports/schemas/report.schema';
import { Posts } from '../posts/schemas/post.schema';
import { CreateReportDto } from './dto/create.dto';
import { UpdateReportDto } from './dto/update.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
    @InjectModel(User.name) private readonly userModel: Model<User>,


  ) {}
  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const { user, post, reason } = createReportDto;
    
    const postExists = await this.postsModel.findById(post).exec();
    if (!postExists) {
      throw new NotFoundException(`Post with ID ${post} not found.`);
    }
 
    const report = new this.reportModel({
      user,
      post,
      reason,
    });
    const savedReport = await report.save();

    const updatedPost = await this.postsModel.findByIdAndUpdate(
      post,
      { $inc: { timeReport: 1 } }, 
      { new: true } 
    ).exec();

    if (updatedPost.timeReport >= 5) {
      await this.postsModel.findByIdAndUpdate(
        post,
        { hide: true }, 
        { new: true } 
      ).exec();
    }
    return savedReport;
  }


  async findReports(): Promise<Report[]> {
    return this.reportModel.find().populate('user').populate('post').exec();
  }

  async findReportById(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }

  async updateReport(id: string, updateReportDto: UpdateReportDto, updatedBy: string): Promise<Report> {
    try {
      const updateFields = {
        ...updateReportDto,
        updatedBy: new Types.ObjectId(updatedBy),
        updatedAt: new Date(), // Explicitly set the updatedAt field
      };

      const updatedReport = await this.reportModel.findByIdAndUpdate(id, updateFields, { new: true }).exec();
      if (!updatedReport) {
        throw new NotFoundException(`Report with ID ${id} not found.`);
      }
      return updatedReport;
    } catch (error) {
      console.error(`Error updating report with ID ${id}:`, error);
      throw new InternalServerErrorException('An error occurred while updating the report.');
    }
  }

  async deleteReportById(id: string): Promise<Report> {
    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
