import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';

import { ArticleInsert } from './models/insert.models';
import { ArticlePagination } from './models/pagination.models';
import { ArticleUpdate } from './models/update.models';
import { ArticleDelete } from './models/delete.models';
import { ArticleDocument } from './models/document.model';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserGuard } from '../common/guards/user.guard';
import { UserSession } from '../common/interfaces';
import { Session } from '../common/decorators';
import { RedisService } from '../redis/redis.service';
import {
  ValidateArticleListResponse,
  ValidateArticleResponse,
} from './dto/responses.dto';
import { InsertArticleBodyDto, UpdateArticleBodyDto } from './dto/requests.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all articles',
    type: ValidateArticleListResponse.schema,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort?: string,
  ): Promise<ArticlePagination> {
    const articleCachedExists = await this.redisService.keyExists('articles');

    if (articleCachedExists) {
      const articles = await this.redisService.getValue('articles');
      return JSON.parse(articles);
    } else {
      const articles = await this.articleService.findAll({ limit, page, sort });
      await this.redisService.setValue('articles', JSON.stringify(articles));
      return articles;
    }
  }

  @Get('my-articles')
  @ApiOkResponse({
    description: 'Get all my articles',
    type: ValidateArticleListResponse.schema,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  async findMyArticles(
    @Session() session: UserSession,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<ArticlePagination> {
    const articles = await this.articleService.findByAuthor(session.login, {
      limit,
      page,
    });
    return articles;
  }

  @Post()
  @ApiOkResponse({
    description: 'Create article',
    type: ValidateArticleResponse.schema,
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async insert(
    @Session() session: UserSession,
    @Body() body: InsertArticleBodyDto,
  ): Promise<ArticleDocument> {
    const insertData: ArticleInsert = {
      title: body.title,
      description: body.description,
      login: session.login,
    };

    const article = await this.articleService.insert(insertData);

    await this.redisService.deleteKey('articles');

    return article;
  }

  @Put(':uuid')
  @ApiOkResponse({
    description: 'Update article',
    type: ValidateArticleResponse.schema,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async update(
    @Session() session: UserSession,
    @Param('uuid') uuid: string,
    @Body() body: UpdateArticleBodyDto,
  ): Promise<ArticleDocument> {
    const updateData: ArticleUpdate = {
      uuid,
      author: session.login,
      title: body.title,
      description: body.description,
    };

    const article = await this.articleService.update(updateData);

    await this.redisService.deleteKey('articles');

    return article;
  }

  @Delete(':uuid')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Delete article' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async delete(
    @Session() session: UserSession,
    @Param('uuid') uuid: string,
  ): Promise<void> {
    const deleteData: ArticleDelete = {
      uuid,
      author: session.login,
    };

    await this.articleService.delete(deleteData);

    await this.redisService.deleteKey('articles');

    return;
  }
}
