import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ArticlesService } from '~starter/modules/articles/articles.service';
import { CreateArticleDto } from '~starter/modules/articles/dto/create-article.dto';
import { UpdateArticleDto } from '~starter/modules/articles/dto/update-article.dto';
import { ArticleEntity } from '~starter/modules/articles/entities/article.entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';

@Controller({
  path: 'articles',
  version: '1',
})
@ApiTags('articles')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorServerEntity,
})
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Article',
    description: 'Creates a new article with the provided details.',
  })
  @ApiCreatedResponse({ type: ArticleEntity })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Find All Articles',
    description: 'Retrieves a list of all articles with pagination support.',
  })
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const articles = await this.articlesService.findAll(page, pageSize);
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @ApiOperation({
    summary: 'Find Draft Articles',
    description: 'Retrieves a list of draft articles with pagination support.',
  })
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const drafts = await this.articlesService.findDrafts(page, pageSize);
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Article by ID',
    description: 'Retrieves an article by its unique identifier.',
  })
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Article',
    description: 'Updates an article with the provided details.',
  })
  @ApiCreatedResponse({ type: ArticleEntity })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove Article',
    description: 'Deletes an article by its unique identifier.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
