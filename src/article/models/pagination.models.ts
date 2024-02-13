import { ArticleDocument } from './document.model';

export interface ArticlePagination {
  items: ArticleDocument[];
  total: number;
  lastPage: number;
}
