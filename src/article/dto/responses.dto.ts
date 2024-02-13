import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import { ValidateResponse } from '../../shared/validator';

@Exclude()
export class Article {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article id',
    example: 'caae9c50-c958-11ee-bc6b-6d4e41eeb440',
  })
  public readonly uuid: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article title',
    example: 'Учительница пристовала к малолетке',
  })
  public readonly title: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article description',
    example: 'Смотреть онлайн без регистрации',
  })
  public readonly description: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article author',
    example: 'IvanZolo2004',
  })
  public readonly author: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article createdAt',
    example: '2024-02-12T05:11:12.948Z',
  })
  createdAt: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Article updatedAt',
    example: '2024-02-12T05:11:12.948Z',
  })
  updatedAt: string;
}

@Exclude()
export class ArticleListResponse {
  @Expose()
  @ApiProperty({ type: [Article] })
  public readonly items: Article[];

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: 'Total articles',
    example: 1,
  })
  public readonly total: number;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Last page',
    example: 1,
  })
  public readonly lastPage: number;
}

export class ValidateArticleListResponse extends ValidateResponse {
  public static schema = ArticleListResponse;
}
export class ValidateArticleResponse extends ValidateResponse {
  public static schema = Article;
}
