
export interface IBlog {
  id?: string;
  title: string;
  previewText: string;
  content: string;
  readingTime: number;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
