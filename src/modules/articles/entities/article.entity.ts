import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@prisma/client';

import { AuthorPublicDto } from '~starter/modules/articles/entities/author.entity';

export class ArticleEntity implements Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  body: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  authorId: string | null;

  @ApiProperty({ type: () => AuthorPublicDto })
  author?: AuthorPublicDto;

  constructor(partial: Partial<ArticleEntity>) {
    Object.assign(this, partial);
    if (partial.author) {
      this.author = new AuthorPublicDto(partial.author);
    }
  }
}
