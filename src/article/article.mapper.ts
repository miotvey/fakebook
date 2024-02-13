import { Injectable } from '@nestjs/common';

import { ArticleDocument } from './models/document.model';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleMapper {
  entityToDocument(article: ArticleEntity): ArticleDocument {
    const document: ArticleDocument = {
      uuid: article.uuid,
      title: article.title,
      description: article.description,
      author: article.author,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };

    return document;
  }
}
