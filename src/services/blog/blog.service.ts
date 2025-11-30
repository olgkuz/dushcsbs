import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../schemas/blog.shema';
import { Model, DeleteResult } from 'mongoose';
import { IBlog } from '../../interfaces/blog';
import { BlogDto } from '../../dto/blog.dto';

type PublicBlog = Omit<IBlog, 'tags'>;

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  private stripTags<T extends { tags?: unknown; toObject?: () => Record<string, unknown> }>(
    input: T,
  ): Omit<T, 'tags'> {
    const raw =
      input && typeof input === 'object' && 'toObject' in input && typeof input.toObject === 'function'
        ? (input.toObject() as Record<string, unknown>)
        : { ...(input as Record<string, unknown>) };

    if ('tags' in raw) {
      delete raw.tags;
    }
    return raw as Omit<T, 'tags'>;
  }

  async createBlog(dto: BlogDto): Promise<PublicBlog> {
    const blog = new this.blogModel(dto);
    const saved = await blog.save();
    return this.stripTags(saved) as PublicBlog;
  }

  async getBlogs(): Promise<PublicBlog[]> {
    const blogs = await this.blogModel.find().sort({ createdAt: -1 }).exec();
    return blogs.map((blog) => this.stripTags(blog) as PublicBlog);
  }

  async getBlogById(id: string): Promise<PublicBlog | null> {
    const blog = await this.blogModel.findById(id).exec();
    return blog ? (this.stripTags(blog) as PublicBlog) : null;
  }

  async deleteBlogs(): Promise<DeleteResult> {
    return this.blogModel.deleteMany().exec();
  }

  async deleteBlogById(id: string): Promise<PublicBlog | null> {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    return deleted ? (this.stripTags(deleted) as PublicBlog) : null;
  }
}
