import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from '../../services/blog/blog.service';
import { BlogDto } from '../../dto/blog.dto';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';

@Controller('articles')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteAll() {
    return this.blogService.deleteBlogs();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return this.blogService.deleteBlogById(id);
  }
}
