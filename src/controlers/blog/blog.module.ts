

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../schemas/blog.shema';
import { BlogController } from './blog.controller';
import { BlogService } from '../../services/blog/blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
