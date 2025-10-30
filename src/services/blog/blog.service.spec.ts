import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { getModelToken } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../schemas/blog.shema';
import { BlogDto } from '../../dto/blog.dto';
import { IBlog } from '../../interfaces/blog';
import type { Model } from 'mongoose';

class BlogModelMock {
  static calls: BlogDto[] = [];

  constructor(private readonly dto: BlogDto) {
    BlogModelMock.calls.push(dto);
  }

  save(): Promise<{ toObject: () => IBlog }> {
    const dto = this.dto;
    return Promise.resolve({
      toObject: () => ({
        id: '1',
        title: dto.title ?? '',
        previewText: dto.previewText ?? '',
        content: dto.content ?? '',
        readingTime: dto.readingTime ?? 0,
        tags: dto.tags ?? [],
      }),
    });
  }
}

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    BlogModelMock.calls = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getModelToken(Blog.name),
          useValue: BlogModelMock as unknown as Model<BlogDocument>,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a blog entry via model', async () => {
    const dto = new BlogDto();
    dto.title = 'Sample Title';
    dto.previewText = 'Sample preview text';
    dto.content = 'Content '.repeat(10);
    dto.readingTime = 5;
    dto.tags = ['tag'];

    const result = await service.createBlog(dto);

    expect(BlogModelMock.calls).toEqual([dto]);
    expect(result).toEqual({
      id: '1',
      title: 'Sample Title',
      previewText: 'Sample preview text',
      content: 'Content '.repeat(10),
      readingTime: 5,
      tags: ['tag'],
    });
  });
});
