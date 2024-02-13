import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { ArticleInsert } from './models/insert.models';
import { ArticleList } from './models/list.models';
import { ArticleUpdate } from './models/update.models';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleRepository {
  public readonly articleRepository: Repository<ArticleEntity>;

  constructor(private readonly datasource: DataSource) {
    this.articleRepository = this.datasource.getRepository(ArticleEntity);
  }
  async insert(data: ArticleInsert): Promise<ArticleEntity> {
    const article = this.articleRepository.create({
      uuid: uuid(),
      title: data.title,
      description: data.description,
      author: data.login,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.articleRepository.insert(article);

    return article;
  }

  async update(data: ArticleUpdate): Promise<UpdateResult> {
    const article = this.articleRepository.update(
      {
        uuid: data.uuid,
      },
      { title: data.title, description: data.description },
    );

    console.log(article);

    return article;
  }

  async delete(uuid: string): Promise<void> {
    await this.articleRepository.delete({
      uuid,
    });

    return;
  }

  async findByAuthor(
    login: string,
    filters: ArticleList,
  ): Promise<ArticleEntity[] | null> {
    const skipRecords = (filters.page - 1) * filters.limit;

    const articles = await this.articleRepository.find({
      where: { author: login },
      take: filters.limit,
      skip: skipRecords,
    });

    console.log(articles);

    return articles;
  }

  async findAll(filters: ArticleList): Promise<ArticleEntity[] | null> {
    const skipRecords = (filters.page - 1) * filters.limit;

    const query = this.articleRepository.createQueryBuilder('articles');

    if (filters.sort === 'new') {
      query.orderBy('articles.createdAt', 'DESC');
    } else if (filters.sort === 'old') {
      query.orderBy('articles.createdAt', 'ASC');
    } else if (filters.sort === 'abc') {
      query.orderBy('articles.title', 'ASC');
    } else if (filters.sort === 'zyx') {
      query.orderBy('articles.title', 'DESC');
    }

    const result = await query.take(filters.limit).skip(skipRecords).getMany();

    console.log(result);

    return result;
  }

  async findOneByUuid(uuid: string): Promise<ArticleEntity | null> {
    const article = await this.articleRepository.findOne({
      where: { uuid },
    });

    return article;
  }

  async countByAuthor(login: string) {
    return this.articleRepository.countBy({
      author: login,
    });
  }

  async count() {
    return this.articleRepository.count();
  }
}
