import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from '../../services/blog/blog.service';
import { BlogDto } from '../../dto/blog.dto';

describe('BlogController', () => {
  let controller: BlogController;
  let blogService: {
    createBlog: jest.Mock;
    getBlogs: jest.Mock;
    getBlogById: jest.Mock;
    deleteBlogs: jest.Mock;
    deleteBlogById: jest.Mock;
  };

  beforeEach(async () => {
    blogService = {
      createBlog: jest.fn(),
      getBlogs: jest.fn(),
      getBlogById: jest.fn(),
      deleteBlogs: jest.fn(),
      deleteBlogById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: blogService }],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates blog via service', async () => {
    const dto = new BlogDto();
    dto.title = 'Title';
    dto.previewText = 'Preview text for blog entry';
    dto.content = 'C'.repeat(60);
    dto.readingTime = 3;
    dto.tags = ['tag'];

    await controller.create(dto);
    expect(blogService.createBlog).toHaveBeenCalledWith(dto);
  });

  it('gets blogs via service', async () => {
    await controller.getAll();
    expect(blogService.getBlogs).toHaveBeenCalledTimes(1);
  });

  it('gets blog by id', async () => {
    await controller.getById('id');
    expect(blogService.getBlogById).toHaveBeenCalledWith('id');
  });

  it('deletes all blogs', async () => {
    await controller.deleteAll();
    expect(blogService.deleteBlogs).toHaveBeenCalledTimes(1);
  });

  it('deletes blog by id', async () => {
    await controller.deleteById('id');
    expect(blogService.deleteBlogById).toHaveBeenCalledWith('id');
  });
});
