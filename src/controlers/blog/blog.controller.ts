import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BlogService } from '../../services/blog/blog.service';
import { BlogDto } from '../../dto/blog.dto';

@Controller('articles')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() blogDto: BlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  async getAll() {
    return this.blogService.getBlogs();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @Delete()
  async deleteAll() {
    return this.blogService.deleteBlogs();
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.blogService.deleteBlogById(id);
  }
}
