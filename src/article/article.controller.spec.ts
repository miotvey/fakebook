import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { RedisService } from '../redis/redis.service';
import { ArticlePagination } from './models/pagination.models';
import { ArticleDocument } from './models/document.model';
import { InsertArticleBodyDto, UpdateArticleBodyDto } from './requests.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let articleService: ArticleService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            findAll: jest.fn(),
            findByAuthor: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            keyExists: jest.fn(),
            getValue: jest.fn(),
            setValue: jest.fn(),
            deleteKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    articleService = module.get<ArticleService>(ArticleService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result: ArticlePagination = { items: [], total: 0, lastPage: 0 };
      jest.spyOn(redisService, 'keyExists').mockResolvedValue(false);
      jest.spyOn(articleService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(10, 1, 'title')).toEqual(result);
      expect(articleService.findAll).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        sort: 'title',
      });
    });
  });

  describe('findMyArticles', () => {
    it('should return an array of user articles', async () => {
      const userSession = { uuid: 'user-uuid', login: 'user1' };
      const result: ArticlePagination = { items: [], total: 0, lastPage: 0 };
      jest.spyOn(articleService, 'findByAuthor').mockResolvedValue(result);

      expect(await controller.findMyArticles(userSession, 10, 1)).toEqual(
        result,
      );
      expect(articleService.findByAuthor).toHaveBeenCalledWith(
        userSession.login,
        {
          limit: 10,
          page: 1,
        },
      );
    });
  });

  describe('insert', () => {
    it('should create and return a new article', async () => {
      const userSession = { uuid: 'user-uuid', login: 'user1' };
      const body: InsertArticleBodyDto = {
        title: 'New Article',
        description: 'Description of new article',
      };
      const expectedResponse = {
        title: body.title,
        description: body.description,
        author: userSession.login,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result: ArticleDocument = {
        ...expectedResponse,
        uuid: 'generated-uuid',
      };

      jest.spyOn(articleService, 'insert').mockResolvedValue(result);
      jest.spyOn(redisService, 'deleteKey').mockResolvedValue();

      const response = await controller.insert(userSession, body);
      expect(response).toEqual(expect.objectContaining(expectedResponse));
      expect(articleService.insert).toHaveBeenCalledWith({
        title: body.title,
        description: body.description,
        login: userSession.login,
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated article', async () => {
      const userSession = { uuid: 'test', login: 'user1' };
      const uuid = 'article-uuid';
      const body: UpdateArticleBodyDto = {
        title: 'Updated Article',
        description: 'Updated description',
      };
      const result: ArticleDocument = {
        uuid: uuid,
        title: body.title,
        description: body.description,
        author: userSession.login,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest.spyOn(articleService, 'update').mockResolvedValue(result);
      jest.spyOn(redisService, 'deleteKey').mockResolvedValue();

      expect(await controller.update(userSession, uuid, body)).toEqual(result);
      expect(articleService.update).toHaveBeenCalledWith({
        uuid,
        author: userSession.login,
        title: body.title,
        description: body.description,
      });
    });
  });

  describe('delete', () => {
    it('should delete the article and return nothing', async () => {
      const userSession = { uuid: 'test', login: 'user1' };
      const uuid = 'article-uuid';
      jest.spyOn(articleService, 'delete').mockResolvedValue();
      jest.spyOn(redisService, 'deleteKey').mockResolvedValue();

      await controller.delete(userSession, uuid);
      expect(articleService.delete).toHaveBeenCalledWith({
        uuid,
        author: userSession.login,
      });
    });
  });
});
