import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { ArticleMapper } from './article.mapper';
import { ArticleDocument } from './models/document.model';
import { ArticleUpdate } from './models/update.models';
import { ArticleDelete } from './models/delete.models';
import { ArticlePagination } from './models/pagination.models';
import { ArticleList } from './models/list.models';
import { ArticleInsert } from './models/insert.models';
@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async insert(data: ArticleInsert): Promise<ArticleDocument> {
    const article = await this.articleRepository.insert({
      title: data.title,
      description: data.description,
      login: data.login,
    });

    const articleDocument = this.articleMapper.entityToDocument(article);
    return articleDocument;
  }

  async update(data: ArticleUpdate): Promise<ArticleDocument> {
    const article = await this.findOneByUuid(data.uuid);

    if (!article) {
      throw new NotFoundException(
        'Статьи, которую вы хотите обновить - не существует',
      );
    }

    if (article.author !== data.author) {
      throw new ForbiddenException('Статья вам не принадлежит!');
    }

    if (!data.title && !data.description) {
      return article;
    }

    data.title = data.title ? data.title : article.title;
    data.description = data.description
      ? data.description
      : article.description;

    await this.articleRepository.update(data);

    return { ...article, ...data };
  }

  async delete(data: ArticleDelete): Promise<void> {
    const article = await this.findOneByUuid(data.uuid);

    if (!article) {
      throw new NotFoundException(
        'Статью, которую вы хотите удалить - не существует',
      );
    }

    if (article.author !== data.author) {
      throw new ForbiddenException('Статья вам не принадлежит!');
    }

    return this.articleRepository.delete(data.uuid);
  }

  async findOneByUuid(uuid: string): Promise<ArticleDocument> {
    const article = await this.articleRepository.findOneByUuid(uuid);

    const articleDocument = this.articleMapper.entityToDocument(article);
    return articleDocument;
  }

  async findByAuthor(
    login: string,
    filters: ArticleList,
  ): Promise<ArticlePagination> {
    const result: ArticlePagination = {
      items: [],
      total: 0,
      lastPage: 0,
    };

    filters.page = filters.page ? filters.page : 1;
    filters.limit = filters.limit ? filters.limit : 15;

    const articles = await this.articleRepository.findByAuthor(login, filters);

    if (articles.length === 0) {
      return result;
    }

    result.items = articles.map((r: any) =>
      this.articleMapper.entityToDocument(r),
    );
    result.total = await this.articleRepository.countByAuthor(login);
    result.lastPage = Math.ceil(result.total / filters.limit ?? 20);

    return result;
  }

  async findAll(filters: ArticleList): Promise<ArticlePagination> {
    const result: ArticlePagination = {
      items: [],
      total: 0,
      lastPage: 0,
    };

    filters.page = filters.page ? filters.page : 1;
    filters.limit = filters.limit ? filters.limit : 15;
    filters.sort = filters.sort ? filters.sort : 'new';

    const articles = await this.articleRepository.findAll(filters);

    if (articles.length === 0) {
      return result;
    }

    result.items = articles.map((a) => this.articleMapper.entityToDocument(a));
    result.total = await this.articleRepository.count();
    result.lastPage = Math.ceil(result.total / filters.limit ?? 20);

    return result;
  }
}
