import { Injectable } from '@nestjs/common';

import { CreateArticleDto } from '~starter/modules/articles/dto/create-article.dto';
import { UpdateArticleDto } from '~starter/modules/articles/dto/update-article.dto';
import { ArticleEntity } from '~starter/modules/articles/entities/article.entity';
import { AuthorPublicDto } from '~starter/modules/articles/entities/author.entity';
import { PrismaService } from '~starter/providers/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private db: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.db.article.create({ data: createArticleDto });
  }

  findAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    return this.db.article.findMany({
      where: { published: true },
      take: pageSize,
      skip,
    });
  }

  findDrafts(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    return this.db.article.findMany({
      where: { published: false },
      take: pageSize,
      skip,
    });
  }

  async findOne(id: number): Promise<ArticleEntity> {
    const article = await this.db.article.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            role: true,
            status: true,
          },
        },
      },
    });

    if (article && article.author) {
      const { firstName, lastName, email } = article.author;
      return new ArticleEntity({
        ...article,
        author: new AuthorPublicDto({
          firstName,
          lastName,
          email,
        }),
      });
    }

    return new ArticleEntity(article);
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.db.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.db.article.delete({ where: { id } });
  }
}
