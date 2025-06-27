
import { IBlog } from '../interfaces/blog';

export class BlogDto implements IBlog {
  title: string;
  previewText: string;
  content: string;
  readingTime: number;
  tags: string[];

  constructor(
    title: string,
    previewText: string,
    content: string,
    readingTime: number,
    tags: string[]
  ) {
    this.title = title;
    this.previewText = previewText;
    this.content = content;
    this.readingTime = readingTime;
    this.tags = tags;
  }
}
