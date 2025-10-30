import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../schemas/blog.shema';
import { Model, DeleteResult } from 'mongoose';
import { IBlog } from '../../interfaces/blog';
import { BlogDto } from '../../dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(dto: BlogDto): Promise<IBlog> {
    const blog = new this.blogModel(dto);
    const saved = await blog.save();
    return saved.toObject();
  }

  async getBlogs(): Promise<IBlog[]> {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return this.blogModel.findById(id).exec();
  }

  async deleteBlogs(): Promise<DeleteResult> {
    return this.blogModel.deleteMany().exec();
  }

  async deleteBlogById(id: string): Promise<IBlog | null> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }
}
